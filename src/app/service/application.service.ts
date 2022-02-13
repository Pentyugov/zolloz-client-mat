import {Injectable} from '@angular/core';
import {ApplicationConstants, Locale} from "../shared/application-constants";
import {BehaviorSubject, Observable} from "rxjs";
import {UserSettings} from "../model/user-settings";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  public host = environment.API_URL;

  private refreshingSource: BehaviorSubject<boolean>;
  public refreshing: Observable<boolean>;

  private settingsSource!: BehaviorSubject<UserSettings>;
  public userSettings!: Observable<UserSettings>;

  constructor(private httpClient: HttpClient) {
    this.refreshingSource = new BehaviorSubject<boolean>(false);
    this.refreshing = this.refreshingSource.asObservable();

    this.settingsSource = new BehaviorSubject<UserSettings>(new UserSettings());
    this.userSettings = this.settingsSource.asObservable();


  }

  public getRefreshing(): boolean {
    return this.refreshingSource.value;
  }

  public changeRefreshing(refreshing: boolean): void {
    this.refreshingSource.next(refreshing);
  }

  public getUserSettings(): UserSettings {
    return this.settingsSource.value;
  }

  public resetUserSettings(): void {
    this.settingsSource.next(new UserSettings());
  }

  public changeSettings(userSettings: UserSettings): void {
    this.settingsSource.next(userSettings);
  }

  public loadUserSettings(): Observable<UserSettings> {
    return this.httpClient.get<UserSettings>(`${this.host}/app/user-settings/get-user-settings`);
  }

  public saveUserSettings(userSettings: UserSettings): Observable<UserSettings> {
    return this.httpClient.post<UserSettings>(`${this.host}/app/user-settings/save-user-settings`, userSettings);
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


}
