import {Component, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractEditor} from "../../../../shared/screens/editor/AbstractEditor";
import {User} from "../../../../model/user";
import {ApplicationConstants} from "../../../../shared/application-constants";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {ApplicationService} from "../../../../service/application.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../service/user.service";
import {Task} from "../../../../model/task";
import {ProjectSaveConfirmComponent} from "../../../projects/project-edit/project-edit.component";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {TaskService} from "../../../../service/task.service";
import {AuthenticationService} from "../../../../service/authentication.service";
import {CustomHttpResponse} from "../../../../model/custom-http-response";
import {TaskExecutionDialogComponent} from "../../task-execution-dialog/task-execution-dialog.component";

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent extends AbstractEditor implements OnInit {
  public currentUser: User = new User();
  public editedTask: Task = new Task();
  public executors: User[] = [];
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
    this.loadExecutors();

    if (!this.isNewItem()) {
      this.editedTask = this.data.editedItem;
      if (this.editedTask.executionDatePlan) {
        this.executionDatePlan = new Date(this.editedTask.executionDatePlan);
      }
    } else {
      this.reloadTask();
    }

  }

  public isNewItem(): boolean {
    return this.dialog_data.isNewItem;
  }

  public loadExecutors(): void {
    this.subscriptions.push(this.userService.getAllWithRole(ApplicationConstants.ROLE_TASK_EXECUTOR).subscribe(
      (response: User[]) => {
        this.executors = response;
        this.editedTask.executor = this.executors.find(d => d.id === this.editedTask.executor?.id)
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  // TODO realize this
  public reloadTask(): void {
    // this.subscriptions.push(this.taskService.get(ApplicationConstants.ROLE_TASK_EXECUTOR).subscribe(
    //   (response: User[]) => {
    //     this.executors = response;
    //     this.editedTask.executor = this.executors.find(d => d.id === this.editedTask.executor?.id)
    //   }, (errorResponse: HttpErrorResponse) => {
    //     this.showErrorNotification(errorResponse.error.message)
    //   }));
  }

  public close() {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_SAVE
      }
    });
  }

  openSaveDialog() {
    const dialogRef = this.dialog.open(ProjectSaveConfirmComponent, {
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

  public onCreateTask(): void {
    this.subscriptions.push(this.taskService.addTask(this.editedTask).subscribe(
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
    this.subscriptions.push(this.taskService.updateTask(this.editedTask).subscribe(
      (response: Task) => {
        if (startTask) {
          this.startTask(response.id);
        }
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Project: ${response.number} was updated successfully`);
        this.close();
      }, (errorResponse: HttpErrorResponse) => {
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
          this.onExecuteTask(result.event.comment);
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
          this.onReworkTask(result.event.comment);
        }
      }
    });
  }

  public onReworkTask(comment: string): void {
    this.subscriptions.push(this.taskService.reworkTask(this.editedTask.id, comment).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));
  }

  public onExecuteTask(comment: string): void {
    this.subscriptions.push(this.taskService.executeTask(this.editedTask.id, comment).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService
        .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
      this.close();
    },(errorResponse: HttpErrorResponse) => {
      this.eventNotificationService
        .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      this.close();
    }));
  }

  public startTask(id: string) : void {
    this.taskService.startTask(id).subscribe((response: CustomHttpResponse) => {
      this.eventNotificationService.showInfoNotification("Success", response.message);
    }, (errorResponse: HttpErrorResponse) => {
      this.showErrorNotification(errorResponse.error.message);
    });
  }

  public onUpdateDueDate(event: any): void {
    this.executionDatePlan = new Date(Date.parse(event.target.value))
    this.editedTask.executionDatePlan = this.executionDatePlan;
  }

  public isStartButtonEnabled(): boolean {
    return !this.editedTask.started && (this.authenticationService.isCurrentUserAdmin() || this.isCurrentUserTaskCreatorOrInitiator());
  }

  public isCurrentUserTaskCreatorOrInitiator(): boolean {
    return this.currentUser.id === this.editedTask.creator?.id ||
           this.currentUser.id === this.editedTask.initiator?.id;
  }

  public isExecuteButtonEnabled(): boolean {
    return this.editedTask.started &&
      (this.editedTask.state === Task.STATE_ASSIGNED || this.editedTask.state === Task.STATE_REWORK) &&
      (this.editedTask.executor?.id === this.currentUser.id || this.authenticationService.isCurrentUserAdmin()) ;
  }

  public isReworkButtonEnabled(): boolean {
    return this.editedTask.started && this.editedTask.state === Task.STATE_EXECUTED &&
      (this.isCurrentUserTaskCreatorOrInitiator() ||
        this.authenticationService.isCurrentUserAdmin()) ;
  }

  public isFieldsEnabled(): boolean {
    if (this.authenticationService.isCurrentUserAdmin()) {
      return true;
    }

    if (this.editedTask.state !== Task.STATE_ASSIGNED && this.editedTask.state !== Task.STATE_REWORK) {
      return this.isCurrentUserTaskCreatorOrInitiator();
    }
    return false;
  }

}
