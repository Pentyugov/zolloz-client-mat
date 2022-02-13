import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationService} from "../../../service/application.service";
import {UserSettings} from "../../../model/user-settings";
import {Subscription} from "rxjs";
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {EventNotificationService} from "../../../service/event-notification.service";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  public userSettings: UserSettings;
  public subscriptions: Subscription[] = [];

  public test: boolean = false;

  constructor(private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService) {

    this.userSettings = this.applicationService.getUserSettings();
    console.log(this.userSettings);
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.userSettings = us;
      console.log('settings subscr constr' + this.userSettings);
    }));
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
        (userSettings: UserSettings) => {
          this.applicationService.changeSettings(userSettings);
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showSuccessNotification(EventNotificationCaptionEnum.SUCCESS,
            'Settings was saved');
        }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        });
  }

  public changeChatNotificationSound($event: any) {
    this.userSettings.enableChatNotificationSound = $event.checked;
  }

  changeMiniSideBar($event: any) {
    this.userSettings.miniSidebar = $event.checked;
  }
}
