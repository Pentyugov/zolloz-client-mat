import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {ApplicationService} from "../../../../service/application.service";
import {UserService} from "../../../../service/user.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {UcWidgetComponent} from "ngx-uploadcare-widget";
import {User} from "../../../../model/user";
import {Role} from "../../../../model/role";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {RoleService} from "../../../../service/role.service";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../../shared/application-constants";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(UcWidgetComponent) widget!: UcWidgetComponent;
  public displayedColumns = ['number', 'assigned', 'name', 'description'];
  public userToCreate: User = new User();
  public roles: Role[] = [];
  public rolesDataSource: MatTableDataSource<Role>;
  public refreshing = true;
  public imageUploaded = false;
  private subscriptions: Subscription[] = [];
  private title: string = '';
  private message: string = '';
  constructor(private applicationService: ApplicationService,
              private userService: UserService,
              private roleService: RoleService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private router: Router,
              private eventNotificationService: EventNotificationService) {

    this.rolesDataSource = new MatTableDataSource<Role>();
    this.refreshing = this.applicationService.getRefreshing();

    this.subscriptions.push(this.applicationService.refreshing.subscribe(refreshing => {
      this.refreshing = refreshing;
    }));

    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.translate.use(us.locale);
    }));
  }

  ngOnInit(): void {
    this.loadRoles();
    this.userToCreate.active = true;
    this.userToCreate.nonLocked = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadRoles(): void {
    this.subscriptions.push(
      this.roleService.getRoles().subscribe(
        (response: Role[]) => {
          this.roles = response;
          this.userToCreate.roles = this.roles.filter(role =>
            role.name.toUpperCase() === ApplicationConstants.DEFAULT_ROLE);

          this.rolesDataSource.data = this.roles;
          this.rolesDataSource.sort = this.sort;
          this.rolesDataSource.paginator = this.paginator;
        })
    );
  }

  public openUploadFileDialog(): void {
    this.widget.openDialog();
  }

  public onUploadComplete($event: any) {
    this.userToCreate.profileImage = $event.cdnUrl;
    this.imageUploaded = true;
    this.widget.clearUploads();
    this.applicationService.changeRefreshing(false);
  }

  public deleteProfileImage() {
    this.applicationService.changeRefreshing(true);
    this.userService.deleteProfileImage(this.userToCreate.id).subscribe(
      (response: User) => {
        this.userToCreate.profileImage = response.profileImage;
        this.applicationService.changeRefreshing(false);

        this.eventNotificationService.showSuccessNotification(EventNotificationCaptionEnum.SUCCESS,
          'Your profile image was successfully deleted');
      }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
        this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,errorResponse.error.message);
      });
  }

  public onProgress($event: any) {
    this.applicationService.changeRefreshing(true);
  }

  public openDialog(action: string, data: any) {
    data.action = action;
    const dialogRef = this.dialog.open(UserAddDialogComponent, {
      data: data,
      width: ApplicationConstants.DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_UPDATE) {
        this.onSaveUser();
      }
    });
  }

  public changeRole($event: any, role: any) {
    if ($event.checked) {
      this.addRoleToUser(role);
    } else {
      this.removeRoleFromUser(role);
    }
  }

  private onSaveUser() {
    this.applicationService.changeRefreshing(true);
    let formData: FormData = this.userService.createUserFormData(this.userToCreate, this.userToCreate.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          this.userToCreate = response;
          this.subscriptions.push(
            this.translate.get('Success').subscribe(m => this.title = m)
          );
          this.subscriptions.push(
            this.translate.get('UserSavedMsg').subscribe(m => this.title = m)
          );

          this.router.navigateByUrl('/organization/users').then(() => {
            this.eventNotificationService.showSuccessNotification(this.title, this.message);
          });

          this.applicationService.changeRefreshing(false);
        }, (errorResponse: HttpErrorResponse) => {
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService
            .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message)
        }));
  }

  private removeRoleFromUser(role: Role): void {
    this.userToCreate.roles = this.userToCreate.roles.filter(r => r.id !== role.id);
  }

  private addRoleToUser(role: Role): void {
    this.userToCreate.roles.push(role);
  }

  public defaultRole(role: Role): boolean {
    return role.name.toUpperCase() === ApplicationConstants.DEFAULT_ROLE;
  }
}

@Component({
  selector: 'app-user-add-dialog',
  templateUrl: 'user-add-dialog.component.html',
  styleUrls: []
})
export class UserAddDialogComponent {
  action: string;
  local_data: any;
  constructor(private translate: TranslateService,
              public dialogRef: MatDialogRef<UserAddDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_UPDATE
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }
}
