import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Role} from "../model/role";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public hasScreenAccess(screenId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.host}/screen-permissions/has-screen-access/${screenId}`);
  }

}
