import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {UserService} from "../../../service/user.service";
import {User} from "../../../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {TranslateService} from "@ngx-translate/core";
import {ApplicationService} from "../../../service/application.service";
import {UserSettings} from "../../../model/user-settings";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../shared/application-constants";
import {CustomHttpResponse} from "../../../model/custom-http-response";
import {EventNotificationService} from "../../../service/event-notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ScreenService} from "../../../service/screen.service";
import {AbstractBrowser} from "../../shared/browser/AbstractBrowser";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  public editorOpened: boolean = false;
  public editedUser: User = new User();
  public users: User[] = [];
  public columnsToDisplay = ApplicationConstants.USER_TABLE_COLUMNS;
  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  private userSettings: UserSettings;
  private userToDelete: User = new User();
  private title: string = '';

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              screenService: ScreenService,
              dialog: MatDialog,
              private userService: UserService) {
    super(router, translate, eventNotificationService, applicationService, dialog, screenService);
    this.userSettings = this.applicationService.getUserSettings();
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.userSettings = us;
      this.translate.use(this.userSettings.locale);
    }));

    this.subscriptions.push(this.applicationService.refreshing.subscribe(refreshing => {
      this.refreshing = refreshing;
    }));
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadUsers(): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
          this.initDataSource(response);
        })
    );
  }

  private initDataSource(users: User[]): void {
    this.dataSource = new MatTableDataSource<User>(users);
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  openDialog(user: User) {
    this.userToDelete = user;
    const dialogRef = this.dialog.open(UserDeleteDialogComponent, {
      data: this.userToDelete,
      width: ApplicationConstants.DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_DELETE) {
        this.onDeleteUser();
      }
    });

  }

  private onDeleteUser(): void {
    this.subscriptions.push(
      this.userService.deleteUser(this.userToDelete.id).subscribe(
        (response: CustomHttpResponse) => {
          this.subscriptions.push(this.translate.get('Success' ,).subscribe(m => this.title = m));
          this.loadUsers();
          this.eventNotificationService.showSuccessNotification(this.title, response.message);
        }, (errorResponse: HttpErrorResponse) => {
          this.subscriptions.push(this.translate.get('Error' ,).subscribe(m => this.title = m));
          this.eventNotificationService.showSuccessNotification(this.title, errorResponse.error.message);
        })
    );
  }

  openEditor(user: User): void {
    this.editedUser = user;
    this.editorOpened = true;
  }


}

@Component({
  selector: 'app-user-delete-dialog',
  templateUrl: 'user-delete-dialog.component.html',
  styleUrls: []
})
export class UserDeleteDialogComponent {
  action: string;
  local_data: any;
  constructor(private translate: TranslateService,
              public dialogRef: MatDialogRef<UserDeleteDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_DELETE
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }
}

