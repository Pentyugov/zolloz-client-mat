import { Injectable } from '@angular/core';
import {ApplicationConstants, Locale} from "../shared/application-constants";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() {

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
