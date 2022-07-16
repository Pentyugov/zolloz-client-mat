import {Component, Inject, Injector, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {UserService} from "../../../../service/user.service";
import {User} from "../../../../model/user";
import {ActivatedRoute, Router} from "@angular/router";
import {Role} from "../../../../model/role";
import {RoleService} from "../../../../service/role.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {UcWidgetComponent} from "ngx-uploadcare-widget";
import {ApplicationService} from "../../../../service/application.service";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";
import {AbstractEditor} from "../../../shared/editor/abstract-editor";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(UcWidgetComponent) widget!: UcWidgetComponent;
  public displayedColumns = ['number', 'assigned', 'name', 'description'];
  public editedUser: User = new User();
  public usernameTitle: string = '';
  public roles: Role[] = [];
  public rolesDataSource: MatTableDataSource<Role>;
  private id: any;
  private title: string = '';
  public userRoles: Role[] = [];

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private activatedRouter: ActivatedRoute,
              private roleService: RoleService,
              private userService: UserService) {
    super(injector, router, translate, eventNotificationService, applicationService, dialog)
    this.id = activatedRouter.snapshot.paramMap.get('id');
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
    this.loadEditedUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadEditedUser(): void {
    this.subscriptions.push(
      this.userService.getById(this.id).subscribe(
        (response: User) => {
          this.editedUser = response;
          this.usernameTitle = this.editedUser.username;
          this.userRoles = this.editedUser.roles;
          this.loadRoles();
        })
    );
  }

  public loadRoles(): void {
    this.subscriptions.push(
      this.roleService.getAll().subscribe(
        (response: Role[]) => {
          this.roles = response;
          this.rolesDataSource.data = this.roles;
          this.rolesDataSource.sort = this.sort;
          this.rolesDataSource.paginator = this.paginator;
        })
    );
  }

  public openDialog(action: string, data: any): void {
    data.action = action;
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      data: data,
      panelClass: this.isDarkMode ? 'dark' : '',
      width: ApplicationConstants.DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_UPDATE) {
        this.onUpdateUser();
      }
    });
  }

  public itemsEquals(objOne: any, objTwo: any): boolean {
    if (objOne && objTwo) {
      return objOne.id === objTwo.id;
    }
    return false;
  }

  public onUpdateUser() {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(
      this.userService.update(this.editedUser).subscribe(
        (response: User) => {
          this.editedUser = response;
          this.applicationService.changeRefreshing(false);
          this.router.navigateByUrl('/organization/users').then(() => {
            this.eventNotificationService.showSuccessNotification('Success', 'User was updated');
          });
        }
      )
    );
  }


  public hasRole(role: Role): boolean {
    for (let r of this.editedUser.roles) {
      if (r.id === role.id) {
        return true;
      }
    }
    return false;
  }

  public changeRole($event: any, role: Role) {
    if ($event.checked) {
      this.addRoleToUser(role);
    } else {
      this.removeRoleFromUser(role);
    }
  }

  public openUploadFileDialog(): void {
    this.widget.openDialog();
  }

  public onUploadComplete($event: any) {
    const profileImageUrl = $event.cdnUrl;
    let formData = new FormData();
    formData.append('id', this.editedUser.id);
    formData.append('profileImageUrl', profileImageUrl);

    this.userService.updateUserProfileImage(formData).subscribe(
      (response: User) => {
        this.editedUser.profileImage = response.profileImage;
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.SUCCESS).subscribe(m => this.title = m);
        this.translate.get('ImageUpdatedSuccess').subscribe(m => this.message = m);
        this.eventNotificationService.showSuccessNotification(this.title, this.message);
      }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.ERROR).subscribe(m => this.title = m);
        this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,errorResponse.error.message);
      });

    this.widget.clearUploads();
  }

  public deleteProfileImage() {
    this.applicationService.changeRefreshing(true);
    this.userService.deleteProfileImage(this.editedUser.id).subscribe(
      (response: User) => {
        this.editedUser.profileImage = response.profileImage;
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

  private removeRoleFromUser(role: Role): void {
    this.editedUser.roles = this.editedUser.roles.filter(r => r.id !== role.id);
  }

  private addRoleToUser(role: Role): void {
    this.editedUser.roles.push(role);
  }
}


@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: 'user-edit-dialog.component.html',
  styleUrls: []
})
export class UserEditDialogComponent {
  action: string;
  local_data: any;
  constructor(private translate: TranslateService,
              public dialogRef: MatDialogRef<UserEditDialogComponent>,
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

