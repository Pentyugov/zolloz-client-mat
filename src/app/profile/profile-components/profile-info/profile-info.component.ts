import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../service/user.service";
import {EventNotificationService} from "../../../service/event-notification.service";
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationService} from "../../../service/application.service";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  public currentUser: User;
  public cloneUser: User;
  @Input()
  public refreshing = false;
  constructor(public dialog: MatDialog,
              public userService: UserService,
              public eventNotificationService: EventNotificationService,
              public applicationService: ApplicationService) {
    this.currentUser = this.userService.getCurrentUser();
    this.cloneUser = this.userService.cloneUser(this.currentUser);
  }

  ngOnInit(): void {

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
  constructor(public dialogRef: MatDialogRef<UpdateProfileDialogComponent>,) {
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
