import {Component, Inject, Injector, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {User} from "../../../../model/user";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {ApplicationService} from "../../../../service/application.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../service/user.service";
import {Task} from "../../../../model/task";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {TaskService} from "../../../../service/task.service";
import {AuthenticationService} from "../../../../service/authentication.service";
import {CustomHttpResponse} from "../../../../model/custom-http-response";
import {TaskExecutionDialogComponent} from "../task-execution-dialog/task-execution-dialog.component";
import {CardHistory} from "../../../../model/card-history";
import {SaveDialogComponent} from "../../../shared/dialog/save-dialog/save-dialog.component";
import {AbstractEditor} from "../../../shared/editor/abstract-editor";
import {Project} from "../../../../model/project";
import {ProjectService} from "../../../../service/project.service";
import {CalendarConfig} from "../../../shared/config/calendar.config";
import {FormControl} from "@angular/forms";
import {NumeratorService} from "../../../../service/numerator.service";
import {NumeratorResponse} from "../../../../model/numerator-response";

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) sort: MatSort = Object.create(null);
  public calendarConfig: CalendarConfig = new CalendarConfig();
  public executionDatePlanForm: FormControl = new FormControl(null);

  public dialogMode: boolean = false;

  public currentUser: User = new User();
  public entity: Task = new Task();
  public executors: User[] = [];
  public cardHistory: CardHistory[] = [];
  public projects: Project[] = [];

  public executionDatePlan: Date | null = null;
  public dialog_data: any;
  public priorities: Object[] = ApplicationConstants.TASK_PRIORITIES;

  private entityId: string = '';
  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              public userService: UserService,
              private taskService: TaskService,
              private numeratorService: NumeratorService,
              private projectService: ProjectService,
              private authenticationService: AuthenticationService,
              private activatedRouter: ActivatedRoute,
              @Optional() public dialogRef: MatDialogRef<TaskEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    super(injector, router, translate, eventNotificationService, applicationService, dialog);
    this.currentUser = this.authenticationService.getUserFromLocalCache();
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this.dialog_data = data;
    this.calendarConfig.stepMinute = 1;
    this.calendarConfig.showSeconds = false;
  }

  ngOnInit(): void {
    if (this.data) {
      this.dialogMode = this.data.dialogMode;
      this.entityId = this.data.entity ? this.data.entity.id : ''
    } else {
      const tmp = this.activatedRouter.snapshot.paramMap.get('id')
      this.entityId =  tmp ? tmp : '';
    }
    if (!this.isNewItem()) {
      this.reloadTask();
      this.loadTaskHistory();
      if (this.entity.executionDatePlan) {
        this.executionDatePlan = new Date(this.entity.executionDatePlan);
      }
    } else {
      this.entity.creator = this.currentUser;
      this.getNextNumber();
      this.prepareDate();
    }

    this.loadProjects();
    this.loadExecutors();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public isNewItem(): boolean {
    if (this.dialog_data) {
      return this.dialog_data.isNewItem;
    } else {
      return this.entityId === '' || this.entityId === null;
    }

  }

  public loadProjects(): void {
    this.subscriptions.push(this.projectService.getAvailableProjects().subscribe(
      (response: Project[]) => {
        this.projects = response;
        this.entity.project = this.projects.find(d => d.id === this.entity.project?.id)
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  public loadExecutors(): void {
    this.subscriptions.push(this.userService.getAllWithRole(ApplicationConstants.ROLE_TASK_EXECUTOR).subscribe(
      (response: User[]) => {
        this.executors = response;
        this.entity.executor = this.executors.find(d => d.id === this.entity.executor?.id)
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
    }));
  }

  public getNextNumber(): void {
    this.subscriptions.push(this.numeratorService.getNumber('next', 'task')
      .subscribe((response: NumeratorResponse) => {
        this.entity.number = response.number;
    }));
  }

  public loadTaskHistory(): void {
    this.subscriptions.push(this.taskService.getTaskHistory(this.entityId).subscribe(
      (response: CardHistory[]) => {
        this.cardHistory = response;
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  public reloadTask(): void {
    this.subscriptions.push(this.taskService.getById(this.entityId).subscribe(
      (response: Task) => {
        this.entity = response;
        if (this.entity.executionDatePlan) {
          this.executionDatePlanForm = new FormControl(new Date(this.entity.executionDatePlan));
        }
        this.loadExecutors();
        this.loadProjects();
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  public updateExecutionDatePlan(): void {
    this.entity.executionDatePlan = this.executionDatePlanForm.value;
  }

  public close() {
    if (this.dialogMode) {
      this.dialogRef.close({
        event: {
          action: ApplicationConstants.DIALOG_ACTION_SAVE
        }
      });
    } else {
      this.router.navigateByUrl('/workflow/tasks')
    }

  }

  public openSaveDialog() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : ''
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
          if (this.isNewItem()) {
            this.onCreateTask();
          } else {
            this.onUpdateTask();
          }

        }
      }
    });
  }

  private onCreateTask(): void {
    this.subscriptions.push(this.taskService.add(this.entity).subscribe(
      (response: Task) => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Task: ${response.number} was created successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      }));
    this.close();
  }

  public updateTask(startTask: boolean = false): void {
    this.entity.executionDatePlan = this.executionDatePlanForm.value;
    if (this.validate()) {
      this.onUpdateTask(startTask);
    }
  }

  private onUpdateTask(startTask: boolean = false): void {
    this.subscriptions.push(this.taskService.update(this.entity).subscribe(
      (response: Task) => {
        if (startTask) {
          this.signalTaskProc(response.id, ApplicationConstants.TASK_ACTION_START, '');
        }
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Task: ${response.number} was updated successfully`);
        this.close();
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        this.close();
      }));
  }

  private validate(): boolean {
    let valid: boolean = true;
    if (this.entity.executionDatePlan) {
      if (this.entity.executionDatePlan < new Date()) {
        valid = false;
        this.getMessage('Tasks.InvalidExecutionDatePlan.Msg').then(message => {
          this.showErrorSnackBar(message);
        });
      }
    }

    return valid;
  }

  private signalTaskProc(taskId: string, action: string, comment: string): void {
    let taskSignalProcRequest = {
      taskId: taskId,
      action: action,
      comment: comment
    }

    this.subscriptions.push(this.taskService.signalTaskProc(taskSignalProcRequest).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));

  }

  public executeTaskBtnClick(): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        caption: 'Confirmation',
        message: 'Tasks.ExecuteTaskMsg'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event.action === ApplicationConstants.DIALOG_ACTION_APPLY) {
          this.signalTaskProc(this.entity.id, ApplicationConstants.TASK_ACTION_EXECUTE, result.event.comment);
        }
      }
    });
  }

  public reworkTaskBtnClick(): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        caption: 'Confirmation',
        message: 'Tasks.ReworkTaskMsg'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event.action === ApplicationConstants.DIALOG_ACTION_APPLY) {
          this.subscriptions.push(this.taskService.update(this.entity).subscribe(
            (response: Task) => {
              this.signalTaskProc(this.entity.id, ApplicationConstants.TASK_ACTION_REWORK, result.event.comment);
              this.eventNotificationService
                .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Task: ${response.number} was updated successfully`);
              this.close();
            }, (errorResponse: HttpErrorResponse) => {
              this.eventNotificationService
                .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
              this.close();
            }));


        }
      }
    });
  }

  public cancelTaskBtnClick(): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        caption: 'Confirmation',
        message: 'Tasks.CancelTaskMsg'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event.action === ApplicationConstants.DIALOG_ACTION_APPLY) {
          this.signalTaskProc(this.entity.id, ApplicationConstants.TASK_ACTION_CANCEL, result.event.comment);
        }
      }
    });
  }

  public finishTaskBtnClick(): void {
    const dialogRef = this.dialog.open(TaskExecutionDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        caption: 'Confirmation',
        message: 'Tasks.FinishTaskMsg'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event.action === ApplicationConstants.DIALOG_ACTION_APPLY) {
          this.signalTaskProc(this.entity.id, ApplicationConstants.TASK_ACTION_FINISH, result.event.comment);
        }
      }
    });
  }

  public onUpdateDueDate(event: any): void {
    this.executionDatePlan = new Date(Date.parse(event.target.value))
    this.entity.executionDatePlan = this.executionDatePlan;
  }

  public isExecutorMissing(): boolean {
    return this.entity.executor == null
  }

  public isStartButtonEnabled(): boolean {
    return !this.entity.started && !this.isExecutorMissing() &&
      (this.authenticationService.isCurrentUserAdmin() || this.isCurrentUserTaskCreatorOrInitiator());

  }

  public isCurrentUserTaskCreatorOrInitiator(): boolean {
    return this.currentUser.id === this.entity.creator?.id ||
           this.currentUser.id === this.entity.initiator?.id;
  }

  public isExecuteButtonEnabled(): boolean {
    return this.entity.started &&
      (this.entity.state === Task.STATE_ASSIGNED || this.entity.state === Task.STATE_REWORK) &&
      (this.entity.executor?.id === this.currentUser.id || this.authenticationService.isCurrentUserAdmin());
  }

  public isReworkButtonEnabled(): boolean {
    return this.entity.started && this.entity.state === Task.STATE_EXECUTED &&
      (this.isCurrentUserTaskCreatorOrInitiator() ||
        this.authenticationService.isCurrentUserAdmin()) ;
  }

  public isCancelButtonEnabled(): boolean {
    if (this.entity.started) {
      return this.authenticationService.isCurrentUserAdmin() ||
        this.isCurrentUserTaskCreatorOrInitiator();
    }

    return false;
  }

  public isFinishButtonEnabled(): boolean {
    if (this.entity.started && this.authenticationService.isCurrentUserAdmin()) {
      return true;
    }
    return this.entity.started &&
      this.entity.state === Task.STATE_EXECUTED &&
      this.isCurrentUserTaskCreatorOrInitiator();
  }

  public isFieldsEnabled(): boolean {
    if (this.authenticationService.isCurrentUserAdmin()) {
      return true;
    }

    if (this.entity.state !== Task.STATE_ASSIGNED && this.entity.state !== Task.STATE_REWORK) {
      return this.isCurrentUserTaskCreatorOrInitiator();
    }
    return false;
  }

  public isExecutionDatePlanFieldEnabled(): boolean {
    if (this.entity.state !== Task.STATE_ASSIGNED && this.entity.state !== Task.STATE_REWORK) {
      return this.isCurrentUserTaskCreatorOrInitiator();
    }
    return false;
  }

  public isExecutorFieldEnabled(): boolean {
    if (this.isNewItem())
      return true;
    return !this.entity.started && this.entity.creator?.id === this.currentUser.id;
  }

  private prepareDate(): void {
    const executionDatePlan = new Date();
    executionDatePlan.setHours(executionDatePlan.getHours() + 1);
    executionDatePlan.setMinutes(0);
    executionDatePlan.setSeconds(0);

    this.executionDatePlanForm = new FormControl(executionDatePlan);
  }

  public getCardHistoryResult(cardHistory: CardHistory): string {
    let message: string;
    if (cardHistory.result === Task.STATE_ASSIGNED)
      message = `${this.getLocMessage(cardHistory.result)} -> ${this.getUserName(this.entity?.executor!)}`;
    else
      message = this.getLocMessage(cardHistory.result);
    return message;
  }

}
