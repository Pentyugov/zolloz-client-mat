import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventNotificationService} from '../../../service/event-notification.service';
import {ApplicationService} from '../../../service/application.service';
import {ApplicationConstants} from '../../application-constants';
import {Subscription} from 'rxjs';

export abstract class AbstractBrowser {

  public messageTitle: string = '';
  public message: string = '';
  public refreshing: boolean = true;
  public selectedRow: any;
  public clickedRow: any;
  public isDarkMode: boolean = false;

  public subscriptions: Subscription[] = [];
  protected constructor(protected router: Router,
                        protected translate: TranslateService,
                        protected eventNotificationService: EventNotificationService,
                        protected applicationService: ApplicationService) {
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.refreshing.subscribe(r => this.refreshing = r));
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this.subscriptions.push(applicationService.darkMode.subscribe(dm => this.isDarkMode = dm));
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

  public getMaxTextLength(text: string, limit: number): string {
    if (text) {
      return text.length > 40 ? text.slice(0, limit) + '...' : text;
    }
    return '';
  }

  public onEnterRow(row: any): void {
    this.selectedRow = row;
  }

  public onLeaveRow(): void {
    this.selectedRow = null;
  }

  public onClickRow(row: any): void {
    this.clickedRow = row;
  }


}
