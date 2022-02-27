import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EventNotificationService } from '../../../service/event-notification.service';
import { ApplicationService } from '../../../service/application.service';
import { ApplicationConstants } from '../../application-constants';

export abstract class AbstractEditor {

  public messageTitle: string = '';
  public message: string = '';

  public subscriptions: Subscription[] = [];
    protected constructor(protected router: Router,
                          protected translate: TranslateService,
                          protected eventNotificationService: EventNotificationService,
                          protected applicationService: ApplicationService) {
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
}
