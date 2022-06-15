import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventNotificationService} from '../../../service/event-notification.service';
import {ApplicationService} from '../../../service/application.service';
import {MatDialog} from "@angular/material/dialog";
import {AbstractWindow} from "../window/abstract-window";

export abstract class AbstractEditor extends AbstractWindow {

  protected constructor(router: Router,
                        translate: TranslateService,
                        eventNotificationService: EventNotificationService,
                        applicationService: ApplicationService,
                        dialog: MatDialog) {
    super(router, translate, eventNotificationService, applicationService, dialog)
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
