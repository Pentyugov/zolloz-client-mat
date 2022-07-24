import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import {environment} from "../../environments/environment";
import {EventNotificationService} from "./event-notification.service";
import {AuthenticationService} from "./authentication.service";
import {HorizontalHeaderComponent} from "../layout/main/horizontal-header/horizontal-header.component";
import {NotificationType} from "../enum/notification-type.enum";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Notification} from "../model/notification";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private host = environment.API_URL;
  private webSocketEndPoint = environment.WS_URL;
  private stompNotificationClient: any;
  private horizontalHeaderComponent: HorizontalHeaderComponent | undefined;
  private topic: string | undefined;

  constructor(private notifier: EventNotificationService,
              private httpClient: HttpClient,
              private authenticationService: AuthenticationService) {
  }

  public _connectToNotificationWs(horizontalHeaderComponent: HorizontalHeaderComponent) {
    const _this = this;
    _this.horizontalHeaderComponent = horizontalHeaderComponent;
    _this.topic = `/user/${_this.authenticationService.getUserFromLocalCache().id}/notifications`
    let ws = new SockJS(_this.webSocketEndPoint);
    _this.stompNotificationClient = Stomp.over(ws);
    _this.stompNotificationClient.debug = function(str: string) {

    };

    _this.stompNotificationClient.connect({}, function () {
      _this.stompNotificationClient.subscribe(_this.topic, function (sdkEvent: any) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  };

  private errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      if (this.horizontalHeaderComponent) {
        this._connectToNotificationWs(this.horizontalHeaderComponent);
      }
    }, 5000);
  }

  public _disconnectFromNotificationWs() {
    if (this.stompNotificationClient !== null) {
      this.stompNotificationClient.disconnect();
    }
    console.log("Disconnected from Notification WS");
  }

  private onMessageReceived(receivedMessage: any) {
    if (this.horizontalHeaderComponent)
      this.horizontalHeaderComponent.handleNotificationMessage();
  }

  public notify(type: NotificationType, caption: string, description: string): void {
    this.notifier.showNotification(type, caption, description);
  }

  public getNotificationPageForCurrentUser(page: number = 0): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${this.host}/notification/get-notification-page-for-receiver?page=${page}`);
  }

  public getAllNotificationsForCurrentUser(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${this.host}/notification/get-all`);
  }

  public deleteNotification(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/notification/delete-notification/${id}`);
  }

}
