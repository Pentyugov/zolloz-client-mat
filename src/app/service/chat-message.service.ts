import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HorizontalHeaderComponent} from "../layout/main/horizontal-header/horizontal-header.component";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import {User} from "../model/user";
import {Observable} from "rxjs";
import {ChatMessage} from "../model/chat-message";

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {

  private host = environment.API_URL;

  private webSocketEndPoint = environment.WS_URL;
  private stompNewChatMessagesClient: any;
  private horizontalHeaderComponent: HorizontalHeaderComponent | undefined;
  private topic: string = '';

  constructor(private httpClient: HttpClient,
              private authenticationService: AuthenticationService) {
  }

  public _connectNewChatMessagesWs(horizontalHeaderComponent: HorizontalHeaderComponent) {
    const _this = this;
    _this.horizontalHeaderComponent = horizontalHeaderComponent;
    _this.topic = `/user/${_this.authenticationService.getUserFromLocalCache().id}/chat/new-messages-count`
    console.log("Initialize New Chat Messages WS Connection");
    let ws = new SockJS(_this.webSocketEndPoint);
    _this.stompNewChatMessagesClient = Stomp.over(ws);
    _this.stompNewChatMessagesClient.debug = function(str: string) {

    };

    _this.stompNewChatMessagesClient.connect({}, function () {
      _this.stompNewChatMessagesClient.subscribe(_this.topic, function (sdkEvent: any) {
        _this.onMessageReceived(sdkEvent);
      });
    }, this.errorCallBack);
  };

  public _disconnectNewChatMessagesWs() {
    if (this.stompNewChatMessagesClient !== null) {
      this.stompNewChatMessagesClient.disconnect();
    }
    console.log("Disconnected from ew Chat Messages WS");
  }

  public getRoomChatMessages(recipient: User): Observable<ChatMessage[]> {
    return this.httpClient.get<ChatMessage[]>(`${this.host}/chat-messages/get-room-messages/${recipient.id}`);
  }

  public getNewMessagesCount(): Observable<number> {
    return this.httpClient.get<number>(`${this.host}/chat-messages/get-new-messages-count`);
  }

  public getMessagesByStatus(status: number): Observable<ChatMessage[]> {
    return this.httpClient.get<ChatMessage[]>(`${this.host}/chat-messages/get-messages-for-current-user?status=${status}`);
  }

  public getUserChatMessagesMap(): Observable<Map<String, ChatMessage[]>> {
    return this.httpClient.get<Map<String, ChatMessage[]>>(`${this.host}/chat-messages/get-user-chat-messages-map`);
  }

  public getUserChatStatusMap(): Observable<Map<String, Number>> {
    return this.httpClient.get<Map<String, Number>>(`${this.host}/chat-messages/get-user-chat-status-map`);
  }

  private onMessageReceived(receivedMessage: any) {
    if (this.horizontalHeaderComponent)
        this.horizontalHeaderComponent.handleChatMessage(receivedMessage, true);
  }

  private errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.stompNewChatMessagesClient(this.horizontalHeaderComponent);
    }, 5000);
  }
}
