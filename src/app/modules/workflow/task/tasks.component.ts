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
  @Input() isWidget: boolean = false;
  @ViewChild(MatPaginator, {static: false}) override paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) override sort: MatSort = Object.create(null);

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
              private taskService: TaskService,) {
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

}
