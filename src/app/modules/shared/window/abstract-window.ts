import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {MatDialog} from "@angular/material/dialog";
import {ApplicationConstants} from "../application-constants";
import {User} from "../../../model/user";
import {Injector} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

export abstract class AbstractWindow {

  public messageTitle: string = '';
  public message: string = '';
  public isDarkMode: boolean = false;
  public refreshing: boolean = true;
  public subscriptions: Subscription[] = [];

  private _snackBar: MatSnackBar;

  protected constructor(public injector: Injector,
                        public router: Router,
                        protected translate: TranslateService,
                        protected eventNotificationService: EventNotificationService,
                        protected applicationService: ApplicationService,
                        protected dialog: MatDialog) {
    this.refreshing = applicationService.getRefreshing();
    this._snackBar = this.injector.get(MatSnackBar);
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

  protected showSuccessNotification(errorMessage: string): void {
    this.subscriptions.push(
      this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_SUCCESS).subscribe(m => this.messageTitle = m)
    );
    this.eventNotificationService.showErrorNotification(this.messageTitle, errorMessage);
  }

  protected showErrorSnackBar(message: string): void {
    this._snackBar.open(message, 'OK');
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

  public async getMessage(key: string): Promise<string> {
    return new Promise((resolve) => {
      this.subscriptions.push(
        this.translate.get(key).subscribe(msg => {
          resolve(msg);
        }));
    });
  }

  public getMaxTextLength(text: string, limit: number): string {
    if (text) {
      return text.length > 40 ? text.slice(0, limit) + '...' : text;
    }
    return '';
  }

}
