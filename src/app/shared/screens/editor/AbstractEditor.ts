import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventNotificationService } from '../../../service/event-notification.service';
import { ApplicationService } from '../../../service/application.service';
import { ApplicationConstants } from '../../application-constants';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../model/user";

export abstract class AbstractEditor {

  public messageTitle: string = '';
  public message: string = '';
  public isDarkMode: boolean = false;
  public refreshing: boolean = true;

  public subscriptions: Subscription[] = [];
    protected constructor(protected router: Router,
                          protected translate: TranslateService,
                          protected eventNotificationService: EventNotificationService,
                          protected applicationService: ApplicationService,
                          protected dialog: MatDialog) {
      this.refreshing = applicationService.getRefreshing();
      this.subscriptions.push(applicationService.refreshing.subscribe(r => this.refreshing = r));
      this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
      this.subscriptions.push(applicationService.darkMode.subscribe(dm => this.isDarkMode = dm));
      this.subscriptions.push(applicationService.darkMode.subscribe(dm => this.isDarkMode = dm));
    }

  protected showErrorNotification(errorMessage: string): void {
    this.subscriptions.push(
      this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => this.messageTitle = m)
    );
    this.eventNotificationService.showErrorNotification(this.messageTitle, errorMessage);
  }

  protected afterCommit(message: string, path: string): void {
    this.subscriptions.push(
      this.translate.get('Success').subscribe(m => this.messageTitle = m)
    );

    this.subscriptions.push(
      this.translate.get(message).subscribe(m => this.message = m)
    );

    this.applicationService.changeRefreshing(false);
    this.router.navigateByUrl(path).then(() => {
      this.eventNotificationService.showSuccessNotification(this.messageTitle, this.message);
    });
  }

  public getUserName(user: User): string {
      if (user.lastName && user.firstName)
        return user.lastName + ' ' + user.firstName
      if (user.username)
        return user.username;
      return '';
  }

  public getLocMessage(alias: string): string {
      let result: string = '';
      this.subscriptions.push(
        this.translate.get(alias).subscribe(m => result = m)
      );

      return result;
  }
}
