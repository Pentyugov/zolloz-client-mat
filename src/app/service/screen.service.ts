import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApplicationService} from "./application.service";
import {ApplicationConstants} from "../shared/application-constants";
import {ScreenPermissions} from "../model/screen-permissions";

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient, private applicationService: ApplicationService) {
  }

  public hasScreenAccess(screenId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.host}/screen-permissions/has-screen-access/${screenId}`);
  }

  public isActionPermit(screenId: string, action: string): boolean {
    let permit: boolean = false;
    for (let sp of this.applicationService.getScreenPermissionsFromLocalStorage()) {
      if (sp.screen === screenId) {
        if (action === ApplicationConstants.SCREEN_ACTION_BROWSE) {
          permit = sp.read;
        } else if (action === ApplicationConstants.SCREEN_ACTION_EDIT) {
          permit = sp.update;
        } else if (action === ApplicationConstants.SCREEN_ACTION_CREATE) {
          permit = sp.create;
        } else if (action === ApplicationConstants.SCREEN_ACTION_DELETE) {
          permit = sp.delete;
        }

        if (permit) {
          return true;
        }
      }
    }

    return false;
  }

}
