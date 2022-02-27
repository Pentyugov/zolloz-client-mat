import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventNotificationService } from '../../../service/event-notification.service';
import { ApplicationService } from '../../../service/application.service';
import { ApplicationConstants } from '../../application-constants';
import { Subscription } from 'rxjs';

export abstract class AbstractBrowser {

  public messageTitle: string = '';
  public message: string = '';
  public refreshing: boolean = true;

  public subscriptions: Subscription[] = [];
  protected constructor(protected router: Router,
                        protected translate: TranslateService,
                        protected eventNotificationService: EventNotificationService,
                        protected applicationService: ApplicationService) {
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.refreshing.subscribe(r => this.refreshing = r));
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
  }

  protected showErrorNotification(errorMessage: string): void {
    this.subscriptions.push(
      this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => this.messageTitle = m)
    );
    this.eventNotificationService.showErrorNotification(this.messageTitle, errorMessage);
  }

  protected afterCommit(message: string): void {
    this.subscriptions.push(
      this.translate.get('Success').subscribe(m => this.messageTitle = m)
    );

    this.subscriptions.push(
      this.translate.get(message).subscribe(m => this.message = m)
    );

    this.applicationService.changeRefreshing(false);
  }
}
