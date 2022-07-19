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

  private readonly defaultFilterPredicate?: (data: Task, filter: string) => boolean;
  private readonly statusFilterPredicate?: (data: Task, filter: string) => boolean;
  private isDefaultPredicate: boolean = true;
  public totalCount = 0;
  public lowPriority = 0;
  public mediumPriority = 0;
  public highPriority = 0;
  public readonly LOW = Task.PRIORITY_LOW;
  public readonly MEDIUM = Task.PRIORITY_MEDIUM;
  public readonly HIGH = Task.PRIORITY_HIGH;

  public expandedElement: Task | null = null

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
    this.defaultFilterPredicate = this.dataSource.filterPredicate;
    this.statusFilterPredicate = (task: Task, filter: string) => {
      if (task.priority)
        return task.priority.toString().trim().toLowerCase() == filter;
      return false;
    };


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

  override afterLoadEntities() {
    super.afterLoadEntities();
    this.initFilters();
  }

  private initFilters(): void {
    this.totalCount = this.dataSource.data.length;
    this.lowPriority = this.btnCategoryClick(this.LOW);
    this.mediumPriority = this.btnCategoryClick(this.MEDIUM);
    this.highPriority = this.btnCategoryClick(this.HIGH);
    this.btnCategoryClick('');
  }

  public btnCategoryClick(val: string): number {
    if (this.isDefaultPredicate) {
      this.changePredicate(this.statusFilterPredicate);
    }
    this.clickedRow = null;
    if (val !== '') {
      this.dataSource.filter = val.toString().trim().toLowerCase();
      return this.dataSource.filteredData.length;
    } else {
      this.clearFilters();
      return this.totalCount;
    }
  }

  private changePredicate(filterPredicate: any): void {
    this.clearFilters();
    this.dataSource.filterPredicate = filterPredicate;
    this.isDefaultPredicate = !this.isDefaultPredicate;
  }

  public clearFilters(){
    this.dataSource.filter = '';
  }


  public getPriority(priority: string): string {
    return priority === this.LOW ? 'Priority.Low' : priority === this.MEDIUM ? 'Priority.Medium' : 'Priority.High';
  }

}
