import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationService} from "../../../service/application.service";
import {UserSettings} from "../../../model/user-settings";
import {Subscription} from "rxjs";
import {CustomHttpResponse} from "../../../model/custom-http-response";
import {EventNotificationService} from "../../../service/event-notification.service";
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  public userSettings: UserSettings;
  public subscriptions: Subscription[] = [];

  constructor(private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService) {

    this.userSettings = this.applicationService.getUserSettings();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => this.userSettings = us));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public changeThemeColor(theme: number): void {
    this.userSettings.themeColor = theme;
  }

  public saveUserSettings(): void {
    this.applicationService.changeRefreshing(true);
    this.applicationService.saveUserSettings(this.userSettings).subscribe(
        (response: CustomHttpResponse) => {
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, response.message);
        }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        });
  }
}
