import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationService} from "../../../service/application.service";
import {UserSettings} from "../../../model/user-settings";
import {Subscription} from "rxjs";
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {EventNotificationService} from "../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  public userSettings: UserSettings;
  public subscriptions: Subscription[] = [];

  private title: string = '';
  private message: string = '';

  public test: boolean = false;

  constructor(public translate: TranslateService,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService) {

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

  public changeThemeColor(theme: number): void {
    this.userSettings.themeColor = theme;
  }

  public saveUserSettings(): void {
    this.applicationService.changeRefreshing(true);
    this.applicationService.saveUserSettings(this.userSettings).subscribe(
        (userSettings: UserSettings) => {
          this.applicationService.changeSettings(userSettings);
          this.applicationService.changeRefreshing(false);
          this.translate.get(EventNotificationCaptionEnum.SUCCESS).subscribe(m => this.title = m);
          this.translate.get('SettingsUpdateSuccess').subscribe(m => this.message = m);
          this.eventNotificationService.showSuccessNotification(this.title, this.message);
        }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.ERROR).subscribe(m => this.title = m);
          this.eventNotificationService.showErrorNotification(this.title, errorResponse.error.message);
        });
  }

  public changeChatNotificationSound($event: any) {
    this.userSettings.enableChatNotificationSound = $event.checked;
  }

  changeMiniSideBar($event: any) {
    this.userSettings.miniSidebar = $event.checked;
  }
}
