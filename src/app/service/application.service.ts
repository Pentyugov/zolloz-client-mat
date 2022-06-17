import {Injectable} from '@angular/core';
import {ApplicationConstants, Locale} from "../shared/application-constants";
import {BehaviorSubject, Observable} from "rxjs";
import {UserSettings} from "../model/user-settings";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {AuthenticationService} from "./authentication.service";
import {ScreenPermissions} from "../model/screen-permissions";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public host = environment.API_URL;

  private refreshingSource: BehaviorSubject<boolean>;
  public refreshing: Observable<boolean>;

  private darkModeSource: BehaviorSubject<boolean>;
  public darkMode: Observable<boolean>;

  private settingsSource!: BehaviorSubject<UserSettings>;
  public userSettings!: Observable<UserSettings>;

  constructor(private httpClient: HttpClient,
              private authenticationService: AuthenticationService) {
    this.refreshingSource = new BehaviorSubject<boolean>(false);
    this.refreshing = this.refreshingSource.asObservable();

    this.settingsSource = new BehaviorSubject<UserSettings>(new UserSettings());
    this.userSettings = this.settingsSource.asObservable();

    this.darkModeSource = new BehaviorSubject<boolean>(false);
    this.darkMode = this.darkModeSource.asObservable();
  }

  public getRefreshing(): boolean {
    return this.refreshingSource.value;
  }

  public changeRefreshing(refreshing: boolean): void {
    this.refreshingSource.next(refreshing);
  }

  public getDarkMode(): boolean {
    return this.darkModeSource.value;
  }

  public changeDarkMode(darkMode: boolean): void {
    this.darkModeSource.next(darkMode);
  }

  public getUserSettings(): UserSettings {
    return this.settingsSource.value;
  }

  public resetUserSettings(): void {
    this.settingsSource.next(new UserSettings());
  }

  public changeSettings(userSettings: UserSettings): void {
    this.saveUserSettingsToLocalStorage(userSettings);
    this.changeDarkMode(userSettings.darkTheme);
    this.settingsSource.next(userSettings);
  }

  public saveScreenPermissionsToLocalStorage(screenPermission: ScreenPermissions[]) {
    localStorage.setItem('screenPermission', JSON.stringify(screenPermission));
  }

  public getScreenPermissionsFromLocalStorage(): ScreenPermissions[] {
    let screenPermission: ScreenPermissions[] = [];
    if (localStorage.getItem('screenPermission') !== null) {
      screenPermission = JSON.parse(localStorage.getItem('screenPermission') as string) as ScreenPermissions[];
    }
    return screenPermission;
  }

  public loadUserSettings(): Observable<UserSettings> {
    return this.httpClient.get<UserSettings>(`${this.host}/app/user-settings/get-user-settings`);
  }

  public loadScreenPermission(): Observable<ScreenPermissions[]> {
    return this.httpClient.get<ScreenPermissions[]>(`${this.host}/screen-permissions/get-all-for-user`);
  }

  public saveUserSettings(userSettings: UserSettings): Observable<UserSettings> {
    return this.httpClient.post<UserSettings>(`${this.host}/app/user-settings/save-user-settings`, userSettings);
  }

  public saveUserSettingsToLocalStorage(userSettings: UserSettings): void {
    localStorage.setItem('userSettings',  JSON.stringify(userSettings));
  }

  public getUserSettingsFromLocalStorage(): UserSettings {
    if (localStorage.getItem('userSettings') !== null) {
      return  JSON.parse(localStorage.getItem('locale') as string) as UserSettings;
    }
    return this.getUserSettings();
  }

  public saveApplicationLocale(locale: Locale): void {
    localStorage.setItem('locale', JSON.stringify(locale));
  }

  public loadApplicationLocale(): Locale {
    if (localStorage.getItem('locale') !== null) {
      return  JSON.parse(localStorage.getItem('locale') as string) as Locale;
    }
    return ApplicationConstants.APP_DEFAULT_LOCALE;
  }

  public playSound(): void {
    if (this.getUserSettings().enableChatNotificationSound) {
      let audio = new Audio('assets/sounds/sound_1.wav');
      audio.play();
    }

  }

  public getThemeColor(): string {
    return this.getUserSettings().themeColor === 10 ? ApplicationConstants.THEME_COLOR_BLUE :
           this.getUserSettings().themeColor === 20 ? ApplicationConstants.THEME_COLOR_RED  :
                                                      ApplicationConstants.THEME_COLOR_GREEN;
  }


}
