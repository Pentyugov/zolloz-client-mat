import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {User} from "../../../../model/user";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
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

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  public currentUser: User = new User();
  public entity: Task = new Task();
  public executors: User[] = [];
  public cardHistory: CardHistory[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) sort: MatSort = Object.create(null);
  public executionDatePlan: Date | null = null;
  public dialog_data: any;
  public priorities: Object[] = ApplicationConstants.TASK_PRIORITIES;
  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private userService: UserService,
              private taskService: TaskService,
              private authenticationService: AuthenticationService,
              public dialogRef: MatDialogRef<TaskEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    super(router, translate, eventNotificationService, applicationService, dialog);
    this.currentUser = this.authenticationService.getUserFromLocalCache();
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this.dialog_data = data;
  }

  ngOnInit(): void {
    if (!this.isNewItem()) {
      this.entity = this.data.entity;
      this.reloadTask();
      this.loadTaskHistory();
      if (this.entity.executionDatePlan) {
        this.executionDatePlan = new Date(this.entity.executionDatePlan);
      }
    } else {
      this.entity.creator = this.currentUser;
    }

    this.loadExecutors();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public isNewItem(): boolean {
    return this.dialog_data.isNewItem;
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

  public loadTaskHistory(): void {
    this.subscriptions.push(this.taskService.getTaskHistory(this.entity.id).subscribe(
      (response: CardHistory[]) => {
        this.cardHistory = response;
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  public reloadTask(): void {
    this.subscriptions.push(this.taskService.getById(this.entity.id).subscribe(
      (response: Task) => {
        this.entity = response;
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  public close() {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_SAVE
      }
    });
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

  public onUpdateTask(startTask: boolean = false): void {
    this.subscriptions.push(this.taskService.update(this.entity).subscribe(
      (response: Task) => {
        if (startTask) {
          this.startTask(response.id);
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

  private startTask(id: string) : void {
    this.subscriptions.push(this.taskService.startTask(id).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService.showInfoNotification("Success", response.message);
    }, (errorResponse: HttpErrorResponse) => {
      this.showErrorNotification(errorResponse.error.message);
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
          this.onExecuteTask(result.event.comment);
        }
      }
    });
  }

  private onExecuteTask(comment: string): void {
    this.subscriptions.push(this.taskService.executeTask(this.entity.id, comment).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));
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
          this.onReworkTask(result.event.comment);
        }
      }
    });
  }

  private onReworkTask(comment: string): void {
    this.subscriptions.push(this.taskService.reworkTask(this.entity.id, comment).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));
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
          this.onCancelTask(result.event.comment);
        }
      }
    });
  }

  private onCancelTask(comment: string): void {
    this.subscriptions.push(this.taskService.cancelTask(this.entity.id, comment).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));
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
          this.onFinishTask(result.event.comment);
        }
      }
    });
  }

  private onFinishTask(comment: string): void {
    this.subscriptions.push(this.taskService.finishTask(this.entity.id, comment).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));
  }

  public onUpdateDueDate(event: any): void {
    this.executionDatePlan = new Date(Date.parse(event.target.value))
    this.entity.executionDatePlan = this.executionDatePlan;
  }

  public isStartButtonEnabled(): boolean {
    return !this.entity.started && (this.authenticationService.isCurrentUserAdmin() || this.isCurrentUserTaskCreatorOrInitiator());
  }

  public isCurrentUserTaskCreatorOrInitiator(): boolean {
    return this.currentUser.id === this.entity.creator?.id ||
           this.currentUser.id === this.entity.initiator?.id;
  }

  public isExecuteButtonEnabled(): boolean {
    return this.entity.started &&
      (this.entity.state === Task.STATE_ASSIGNED || this.entity.state === Task.STATE_REWORK) &&
      (this.entity.executor?.id === this.currentUser.id || this.authenticationService.isCurrentUserAdmin()) ;
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

  public isExecutorFieldEnabled(): boolean {
    if (this.isNewItem())
      return true;

    return !this.entity.started;
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
