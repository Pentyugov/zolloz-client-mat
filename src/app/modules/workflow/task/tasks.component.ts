import {Component, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {ScreenService} from "../../../service/screen.service";
import {MatDialog} from "@angular/material/dialog";
import {TaskService} from "../../../service/task.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApplicationConstants} from "../../shared/application-constants";
import {Task} from "../../../model/task";
import {TaskEditComponent} from "./tast-edit/task-edit.component";
import {NewAbstractBrowser} from "../../shared/browser/new-abstract.browser";
import {HttpErrorResponse} from "@angular/common/http"
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {ProjectService} from "../../../service/project.service";
import {Project} from "../../../model/project";
import {FormControl} from "@angular/forms";
import {TaskFilterRequest} from "../../../web/payload/request/task-filter-request";
import {TaskFilter} from "../../../utils/filters/task-filter";

interface Filter {
  name: string;
}

interface FilterOption {
  id: string;
  name: string;
}

interface AppliedFilter {
  property: string;
  condition: string;
  options: FilterOption[];
}

@Component({
  selector: 'app-task',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TasksComponent extends NewAbstractBrowser<Task> implements OnInit {

  public filtersList: Filter[] = [
    {
      name: 'executor'
    },
    {
      name: 'priority'
    },
    {
      name: 'project'
    }
  ];

  public appliedFilters: AppliedFilter[] = [{
    property: 'state',
    condition: Task.STATE_ASSIGNED,
    options: [
      {
        id: Task.STATE_ASSIGNED,
        name: Task.STATE_ASSIGNED
      },
      {
        id: Task.STATE_REWORK,
        name: Task.STATE_REWORK
      },
      {
        id: Task.STATE_EXECUTED,
        name: Task.STATE_EXECUTED
      },
      {
        id: Task.STATE_CREATED,
        name: Task.STATE_CREATED
      },
      {
        id: Task.STATE_FINISHED,
        name: Task.STATE_FINISHED
      },
      {
        id: Task.STATE_CANCELED,
        name: Task.STATE_CANCELED
      },
      {
        id: Task.STATE_CLOSED,
        name: Task.STATE_CLOSED
      }
    ]
  }];

  @Input() isWidget: boolean = false;
  @ViewChild(MatPaginator, {static: false}) override paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) override sort: MatSort = Object.create(null);

  filterControl = new FormControl('', []);

  public columnsToDisplay: string[] = [];

  public totalCount = 0;
  public lowPriority = 0;
  public mediumPriority = 0;
  public highPriority = 0;
  public readonly ALL = 'ALL';
  public readonly LOW = Task.PRIORITY_LOW;
  public readonly MEDIUM = Task.PRIORITY_MEDIUM;
  public readonly HIGH = Task.PRIORITY_HIGH;

  public expandedElement: Task | null = null;

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              private taskService: TaskService,
              private projectService: ProjectService) {
    super(injector,
      router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      TaskEditComponent,
      taskService,
      editor,
      screenService);

    this.id = 'screen$Tasks';

  }

  ngOnInit(): void {
    this.columnsToDisplay = this.isWidget ? ApplicationConstants.TASK_TABLE_COLUMNS_WIDGET : ApplicationConstants.TASK_TABLE_COLUMNS;
    this.loadEntities();
  }

  public override loadEntities(): void {
    if (this.isWidget) {
      this.loadActiveTaskForExecutor();
    } else {
      this.subscriptions.push(
        this.entityService.getAll().subscribe(
          (response: Task[]) => {
            this.entities = response;
            this.totalCount = response.length;
            this.lowPriority = this.filterByPriority(this.LOW).length;
            this.mediumPriority = this.filterByPriority(this.MEDIUM).length;
            this.highPriority = this.filterByPriority(this.HIGH).length;
            this.initDataSource(response);
            this.afterLoadEntities();
          }, (errorResponse: HttpErrorResponse) => {
            this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
          }
        )
      );
    }
  }

  private loadActiveTaskForExecutor(): void {
    this.subscriptions.push(
      this.taskService.getActiveForExecutor().subscribe(
        (response: Task[]) => {
          this.entities = response;
          this.initDataSource(response);
          this.afterLoadEntities();
        }, (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
        }
      )
    );
  }

  private filterByPriority(priority: string, initDs: boolean = false): Task[] {
    let sorted: Task[] = [];

    if (priority === this.ALL) {
      sorted = this.entities as Task[];
    } else {
      this.entities.forEach(tmp => {
        const task = tmp as Task;
        if (task.priority === priority)
          sorted.push(task);
      });
    }

    if (initDs) {
      this.initDataSource(sorted);
    }


    return sorted;
  }

  override afterLoadEntities() {
    super.afterLoadEntities();
    this.initFilters();
  }

  protected override initDataSource(tasks: Task[]): void {
    this.dataSource = new MatTableDataSource<Task>(tasks);
    this.dataSource.filterPredicate = (task: Task, filter: string) => {

      return task.number.toLocaleLowerCase().includes(filter)
        || task.description.toLocaleLowerCase().includes(filter)
        || task.state.toLocaleLowerCase().includes(filter)
        || this.projectFilter(task, filter)
        || this.executorFilter(task, filter)
        || this.initiatorFilter(task, filter)
    }

    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private projectFilter(task: Task, filter: string): boolean {
    if (task.project)
      return task.project.name.includes(filter);
    return false;
  }

  private executorFilter(task: Task, filter: string): boolean {
    if (task.executor)
      return task.executor.username.includes(filter);
    return false;
  }

  private initiatorFilter(task: Task, filter: string): boolean {
    if (task.initiator)
      return task.initiator.username.includes(filter);
    return false;
  }

  private initFilters(): void {

  }


  public getPriority(priority: string): string {
    return priority === this.LOW ? 'Priority.Low' : priority === this.MEDIUM ? 'Priority.Medium' : 'Priority.High';
  }

  public addFilter($event: any): void {
    const filter: AppliedFilter = {
      property: $event.value.name,
      condition: '',
      options: []
    }

    if ($event.value.name === 'project') {
      this.subscriptions.push(this.projectService.getAvailableProjects().subscribe((response: Project[]) => {
        response.forEach(project => filter.options.push(TasksComponent.createFilterOption(project.id, project.name)))
      }));
    } else if ($event.value.name === 'executor') {
      filter.options = this.fillExecutorsOptions();
    } else if ($event.value.name === 'priority') {
      filter.options = [
        {
          id: Task.PRIORITY_LOW,
          name: Task.PRIORITY_LOW
        },
        {
          id: Task.PRIORITY_MEDIUM,
          name: Task.PRIORITY_MEDIUM
        },
        {
          id: Task.PRIORITY_HIGH,
          name: Task.PRIORITY_HIGH
        },
      ]
    }

    this.appliedFilters.push(filter);
    this.filterControl.setValue(null);
  }

  private fillExecutorsOptions(): FilterOption[] {
    let options: FilterOption[] = [];

    this.entities.forEach(entity => {
      const task = entity as Task;

      if (task.executor) {
        const tmp = options.find(d => d.id === task.executor?.id);
        if (!tmp) {
          const option: FilterOption = {
            id: task.executor.id,
            name: task.executor.username
          }

          options.push(option);
        }
      }

    });

    return options;
  }

  private static createFilterOption(id: string, name: string): FilterOption {
    return {
      id: id,
      name: name
    }
  }

  public isFilterInList(filter: Filter): boolean {
    let isPresent: boolean = false;
    this.appliedFilters.forEach(f => {
      if (f.property === filter.name)
        isPresent = true;
    });

    return isPresent;
  }

  public removeFilter(filter: AppliedFilter): void {
    const index = this.appliedFilters.indexOf(filter);
    if (index > -1)
      this.appliedFilters.splice(index, 1);
  }

  public onApplyFilters(): void {
    const taskFilterRequest: TaskFilterRequest = new TaskFilterRequest();

    // this.dataSource.data.forEach(task => {
    //   taskFilterRequest.ids.push(task.id);
    // });

    this.appliedFilters.forEach(t => {
      const taskFilter: TaskFilter = {
        property: t.property,
        condition: t.condition
      }
      taskFilterRequest.taskFilters.push(taskFilter);
    });

    this.subscriptions.push(this.taskService.applyTaskFilters(taskFilterRequest).subscribe((response: Task[]) => {
      this.initDataSource(response);
    }, (errorResponse: HttpErrorResponse) => {
      this.log(errorResponse.error.messages)
    }));
  }


  public log(message: any): void {
    console.log(message);
  }

}
