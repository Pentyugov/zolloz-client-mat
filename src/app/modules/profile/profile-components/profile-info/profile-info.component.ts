import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../../../model/user";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../service/user.service";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationService} from "../../../../service/application.service";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public currentUser: User;
  // public cloneUser: User;

  private title: string = '';
  private message: string = '';
  constructor(public dialog: MatDialog,
              public userService: UserService,
              public translate: TranslateService,
              public eventNotificationService: EventNotificationService,
              public applicationService: ApplicationService,
  ) {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);

  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public refreshData() {
    this.currentUser = this.userService.getCurrentUser();
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
    console.log('on update')
    console.log(this.currentUser.nonLocked)
    this.userService.update(this.currentUser).subscribe(
      (response: User) => {
        this.userService.changeCurrentUser(response);
        this.currentUser = this.userService.getCurrentUser();
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.SUCCESS).subscribe(m => this.title = m);
        this.translate.get('ProfileUpdatedSuccess').subscribe(m => this.message = m);
        this.eventNotificationService.showSuccessNotification(this.title, this.message);
      }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.ERROR).subscribe(m => this.title = m);
        this.eventNotificationService.showErrorNotification(this.title, errorResponse.error.message);

      });
  }
}

@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: []
})
export class UpdateProfileDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<UpdateProfileDialogComponent>) {
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
