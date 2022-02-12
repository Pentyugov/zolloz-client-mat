import {Injectable} from '@angular/core';
import {ApplicationConstants, Locale} from "../shared/application-constants";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private refreshingSource: BehaviorSubject<boolean>;
  public refreshing: Observable<boolean>;

  constructor() {
    this.refreshingSource = new BehaviorSubject<boolean>(false);
    this.refreshing = this.refreshingSource.asObservable();
  }

  public getRefreshing(): boolean {
    return this.refreshingSource.value;
  }

  public changeRefreshing(refreshing: boolean): void {
    this.refreshingSource.next(refreshing);
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
