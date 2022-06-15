import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatMessage} from "../../../model/chat-message";
import {ApplicationService} from "../../../service/application.service";
import {AuthenticationService} from "../../../service/authentication.service";
import {UserService} from "../../../service/user.service";
import {ChatMessageService} from "../../../service/chat-message.service";
import {AbstractWindow} from "../../../shared/screens/window/abstract-window";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../../model/user";
import {HttpErrorResponse} from "@angular/common/http";
import {ChatMessageStatus} from "../../../enum/chat-message-status.enum";
import {ChatService} from "../../../service/chat.service";
import {UserSettings} from "../../../model/user-settings";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends AbstractWindow implements OnInit, OnDestroy {
  public config: PerfectScrollbarConfigInterface = {

  };

  sidePanelOpened = true;
  msg = '';
  selectedMessage!: ChatMessage;

  messages: ChatMessage[] = [];


  // my attributes
  public chatSelected: boolean = false;
  public users: User[] = [];
  public recipient: User = new User();
  public currentUser: User = new User();
  public chatService: ChatService;
  public chatMessageToSend: ChatMessage = new ChatMessage();

  public userChatMessageMap: Map<String, ChatMessage[]> = new Map<String, ChatMessage[]>();
  public userChatStatusMap: Map<String, Number> = new Map<String, Number>();

  private userSettings: UserSettings = new UserSettings();
  connected: boolean = false;


  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private chatMessageService: ChatMessageService) {
    super(router, translate, eventNotificationService, applicationService, dialog);

    this.getUsers();
    this.currentUser = this.authenticationService.getUserFromLocalCache();
    this.chatService = new ChatService(this, this.currentUser.id, this.authenticationService);
    this.connect();
    this.getUserChatMessagesMap();
    this.getUserChatStatusMap();
    this.userSettings = this.applicationService.getUserSettings();
  }

  ngOnDestroy() {
    this.disconnect();
  }

  public getUserChatMessagesMap(): void {
    this.chatMessageService.getUserChatMessagesMap().subscribe(
      (response) => {
        Object.entries(response).forEach(([key, value]) => {
          this.userChatMessageMap.set(key, value);
        });
      }
    );
  }

  public getUserChatStatusMap(): void {
    this.chatMessageService.getUserChatStatusMap().subscribe(
      (response) => {
        Object.entries(response).forEach(([key, value]) => {
          this.userChatStatusMap.set(key, value);
        });
      }
    );
  }

  private connect(){
    this.chatService._connectToChat();
    this.connected = true;
  }

  private disconnect(){
    this.chatService._disconnectFromChat();
    this.connected = false;
  }

  private getUsers(): void {
    this.subscriptions.push(this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message())
      }
    ))
  }

  public handleMessage(message: ChatMessage): void {
    const senderId = message.senderId;
    message.status = senderId === this.recipient.id ? ChatMessageStatus.READ : ChatMessageStatus.RECEIVED;
    this.chatService._updateMessage(message);

    let userChatMessages = this.userChatMessageMap.get(senderId);
    if (userChatMessages) {
      userChatMessages.push(message);
    } else {
      let newUserChatMessages: ChatMessage[] = [];
      newUserChatMessages.push(message);
      this.userChatMessageMap.set(senderId, newUserChatMessages);
    }
  }

  public changeChatRoom(user: User): void {
    this.recipient = user;
    this.chatSelected = true;
    let userChatMessages = this.userChatMessageMap.get(this.recipient.id);
    if (userChatMessages) {
      this.messages = userChatMessages;
    } else {
      let newUserChatMessages: ChatMessage[] = [];
      this.userChatMessageMap.set(this.recipient.id, newUserChatMessages);
    }

    this.messages = this.userChatMessageMap.get(this.recipient.id) as ChatMessage[];

    for (let chatMessage of this.messages) {
      if (chatMessage.status !== ChatMessageStatus.READ && chatMessage.senderId !== this.currentUser.id) {
        chatMessage.status = ChatMessageStatus.READ;
        this.chatService._updateMessage(chatMessage);
      }
    }
  }

  public getLastMessage(user: User): string {
    let lastMessage: string = ''
    let tmp: ChatMessage[] | undefined = this.userChatMessageMap.get(user.id);
    if (tmp) {
      lastMessage = tmp[tmp.length - 1].content;

    }

    return lastMessage.slice(0, 10)
  }

  public sendMessage(): void {
    if (this.chatMessageToSend.content.trim() !== '') {
      this.chatMessageToSend.senderId = this.currentUser.id;
      this.chatMessageToSend.recipientId = this.recipient.id;
      this.chatMessageToSend.status = 10;
      this.playSound();
      this.chatService._sendMessage(this.chatMessageToSend);
      this.userChatMessageMap.get(this.recipient.id)?.push(this.chatMessageToSend);
      this.chatMessageToSend = new ChatMessage();
    } else {
      this.chatMessageToSend.content = '';
    }

  }

  private playSound(): void {
    let audio = new Audio('assets/sounds/send-message-effect.mp3');
    audio.play();
  }

  public onUserChangeStatus() {
    this.getUserChatStatusMap();
  }

























































  @ViewChild('myInput', { static: true })
  myInput: ElementRef = Object.create(null);

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(message: ChatMessage): void {
    this.selectedMessage = message;
  }

  OnAddMsg(): void {
    // this.msg = this.myInput.nativeElement.value;
    //
    // if (this.msg !== '') {
    //   this.selectedMessage.chat.push({
    //     type: 'even',
    //     msg: this.msg,
    //     date: new Date(),
    //   });
    // }
    //
    // this.myInput.nativeElement.value = '';
  }

  ngOnInit(): void {
    console.log('chat')
  }
}
