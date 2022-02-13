import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../service/user.service";
import {EventNotificationService} from "../../../service/event-notification.service";
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationService} from "../../../service/application.service";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {UserSettings} from "../../../model/user-settings";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  public currentUser: User;
  public cloneUser: User;
  private subscriptions: Subscription[] = [];
  private userSettings: UserSettings;
  constructor(public dialog: MatDialog,
              public userService: UserService,
              public eventNotificationService: EventNotificationService,
              public applicationService: ApplicationService,
              private translate: TranslateService) {
    this.currentUser = this.userService.getCurrentUser();
    this.cloneUser = this.userService.cloneUser(this.currentUser);
    this.userSettings = this.applicationService.getUserSettings();
    this.translate.use(this.userSettings.locale);
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.userSettings = us;
      this.translate.use(this.userSettings.locale);
    }));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public refreshData() {
    this.currentUser = this.userService.getCurrentUser();
    this.cloneUser = this.userService.cloneUser(this.currentUser);
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.$event === 'Update') {
        this.onUpdateUser();
      } else if (result.$event === 'Cancel') {
       this.refreshData();
      }
    });
  }

  public onUpdateUser(): void {
    this.applicationService.changeRefreshing(true);
    let formData = this.userService.createUserFormData(this.cloneUser, null);
    this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.userService.changeCurrentUser(response);
        this.currentUser = this.userService.getCurrentUser();
        this.cloneUser = this.userService.cloneUser(this.currentUser);
        this.applicationService.changeRefreshing(false);
        this.eventNotificationService.showSuccessNotification(EventNotificationCaptionEnum.SUCCESS,
          'You profile was successfully updated');
      }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
        this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,
          errorResponse.error.message);
        this.cloneUser = this.userService.cloneUser(this.currentUser);
      });
  }
}

@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: []
})
export class UpdateProfileDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
              public translate: TranslateService) {
  }
  ngOnInit(): void {

  }

  public onUpdateProfileInfo() {
    this.dialogRef.close({$event: 'Update'});
  }

  public closeDialog() {
    this.dialogRef.close({$event: 'Cancel'});
  }
}
