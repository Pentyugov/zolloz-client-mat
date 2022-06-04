import {Component, OnDestroy, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {User} from "../../../model/user";
import {Router} from "@angular/router";
import {ApplicationService} from "../../../service/application.service";
import {ApplicationConstants, Locale} from "../../../shared/application-constants";
import {UserService} from "../../../service/user.service";
import {Subscription} from "rxjs";
import {UserSettings} from "../../../model/user-settings";
import {NotificationService} from "../../../service/notification.service";
import {Notification} from "../../../model/notification";

@Component({
  selector: 'app-horizontal-header',
  templateUrl: './horizontal-header.component.html',
  styleUrls: [],
})
export class HorizontalHeaderComponent implements OnInit, OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};

  notifications: Notification[] = [];

  newMessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM',
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM',
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM',
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM',
    },
  ];

  public selectedLocale: Locale = ApplicationConstants.APP_DEFAULT_LOCALE;
  public locales: Locale[] = ApplicationConstants.APP_LOCALES;
  private subscriptions: Subscription[] = [];
  private userSettings: UserSettings;
  public currentUser: User = new User;

  constructor(private translate: TranslateService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router,
              private applicationService: ApplicationService,
              private notificationService: NotificationService) {
    this.userSettings = this.applicationService.getUserSettings();
    this.setDefaultLocale();
    translate.setDefaultLang(this.selectedLocale.code);
    this.currentUser = this.userService.getCurrentUser();
    this.subscriptions.push(this.userService.currentUser.subscribe(cu => this.currentUser = cu));
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.userSettings = us;
      this.setDefaultLocale();
    }));
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.notificationService._connectToNotificationWs(this);
  }

  ngOnDestroy(): void {
    this.notificationService._disconnectFromNotificationWs();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadNotifications() {
    this.notificationService.getAllNotificationsForCurrentUser().subscribe(
      (response: Notification[]) => {
        this.notifications = response;
      }
    )
  }

  public deleteNotification(notification: Notification): void {
    this.subscriptions.push(this.notificationService.deleteNotification(notification.id).subscribe(() => {
        this.loadNotifications();
      }
    ));
  }

  public changeLanguage(locale: Locale): void {
    this.userSettings.locale = locale.code;
    this.translate.use(locale.code);
    this.selectedLocale = locale;

    this.applicationService.saveUserSettings(this.userSettings).subscribe(
      (response: UserSettings) => {
        this.applicationService.changeSettings(response);
        this.userSettings = this.applicationService.getUserSettings();
      }
    );
  }

  public onLogout() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.authenticationService.logOut(true);
  }

  public setDefaultLocale(): void {
    this.locales.forEach(locale => {
      if (locale.code === this.userSettings.locale) {
        this.selectedLocale = locale;
        this.translate.use(locale.code);
        return;
      }
    });
  }

  public navigate(route: string) {
    this.router.navigateByUrl(route).then(() => {

    });
  }

  public handleWsMessage() {
    this.loadNotifications();
    this.playSound();
  }

  public getRoundClass(notification: Notification): string {
    if (notification) {
      if (notification.type === ApplicationConstants.NOTIFICATION_TYPE_SUCCESS)
        return 'round-success';
      if (notification.type === ApplicationConstants.NOTIFICATION_TYPE_INFO)
        return 'round-info';
      if (notification.type === ApplicationConstants.NOTIFICATION_TYPE_WARNING)
        return 'round-warning';
      if (notification.type === ApplicationConstants.NOTIFICATION_TYPE_DANGER)
        return 'round-danger';
    }

    return 'round-info';
  }

  public getIconClass(notification: Notification): string {
    if (notification) {
      if (notification.type === ApplicationConstants.NOTIFICATION_ACCESSORY_SYSTEM)
        return 'ti-settings';
      if (notification.type === ApplicationConstants.NOTIFICATION_ACCESSORY_TODO)
        return 'ti-receipt';
      if (notification.type === ApplicationConstants.NOTIFICATION_ACCESSORY_CALENDAR)
        return 'ti-calendar';
      if (notification.type === ApplicationConstants.NOTIFICATION_ACCESSORY_WORKFLOW)
        return 'ti-bar-chart';
    }

    return 'round-info';
  }

  public playSound(): void {
    this.applicationService.playSound();
  }



}
