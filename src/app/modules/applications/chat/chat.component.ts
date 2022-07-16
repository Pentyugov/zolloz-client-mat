import {Component, ElementRef, Injector, OnDestroy, ViewChild} from '@angular/core';
import {ChatMessage} from "../../../model/chat-message";
import {ApplicationService} from "../../../service/application.service";
import {AuthenticationService} from "../../../service/authentication.service";
import {UserService} from "../../../service/user.service";
import {ChatMessageService} from "../../../service/chat-message.service";
import {AbstractWindow} from "../../shared/window/abstract-window";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../../model/user";
import {HttpErrorResponse} from "@angular/common/http";
import {ChatMessageStatus} from "../../../enum/chat-message-status.enum";
import {ChatService} from "../../../service/chat.service";
import {UserSettings} from "../../../model/user-settings";
import {PerfectScrollbarComponent, PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends AbstractWindow implements OnDestroy {
  @ViewChild('messageInput', { static: true }) messageInput: ElementRef = Object.create(null);
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent | undefined;
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

  public config: PerfectScrollbarConfigInterface = {

  };

  // my attributes
  public chatSelected: boolean = false;
  public sidePanelOpened = true;
  public messages: ChatMessage[] = [];
  public users: User[] = [];
  public recipient: User = new User();
  public currentUser: User = new User();
  public chatService: ChatService;
  public chatMessageToSend: ChatMessage = new ChatMessage();
  public userChatMessageMap: Map<String, ChatMessage[]> = new Map<String, ChatMessage[]>();
  public userChatStatusMap: Map<String, Number> = new Map<String, Number>();
  public userTotalPagesMap: Map<String, Number> = new Map<String, Number>();
  private userSettings: UserSettings = new UserSettings();
  private connected: boolean = false;
  private page = 0;
  private totalPages: Number | undefined = 0;
  private selectedChatId: string = '';

  throttle = 300;


  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private chatMessageService: ChatMessageService) {
    super(injector, router, translate, eventNotificationService, applicationService, dialog);

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

  public isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  public getUserChatMessagesMap(): void {
    this.subscriptions.push(
      this.chatMessageService.getUserChatMessagesMap().subscribe(
        (response) => {
          Object.entries(response).forEach(([key, chatMessagePageResponse]) => {
            this.userChatMessageMap.set(key, chatMessagePageResponse.messages);
            this.userTotalPagesMap.set(key, chatMessagePageResponse.totalPages);
          });
        }
      )
    );

  }

  public getNextChatMessagesPage(): void {
    if (this.selectedChatId !== null && this.selectedChatId !== undefined && this.selectedChatId !== '') {
      this.page++;
      this.subscriptions.push(
        this.chatMessageService.getNextChatMessagesPage(this.page, this.selectedChatId).subscribe(
          (response) => {
            let tmp: ChatMessage[] = response;
            this.messages.forEach(m => {
              this.setMessageAsRead(m);
              tmp.push(m);
            });
            this.messages = tmp;
          }
        ));
    }
  }

  private setMessageAsRead(message: ChatMessage): void {
    if (this.currentUser.id === message.recipientId && message.status !== ChatMessage.READ) {
      message.status = ChatMessage.READ;
      this.chatService._updateMessage(message)
    }
  }

  public onListScroll(): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      if (this.componentRef.directiveRef.position(true).y === 0) {
        if (this.totalPages && this.page < this.totalPages) {
          this.getNextChatMessagesPage();
          this.componentRef.directiveRef.scrollToY(1);
        }
      }
    }
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

  private connect() {
    this.chatService._connectToChat();
    this.connected = true;
  }

  private disconnect(){
    this.chatService._disconnectFromChat();
    this.connected = false;
  }

  private getUsers(): void {
    this.subscriptions.push(this.userService.getAll().subscribe(
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
    this.page = 0;
    this.totalPages = this.userTotalPagesMap.get(this.recipient.id);
    if (userChatMessages) {
      this.messages = userChatMessages;
      this.messages.forEach(m => this.setMessageAsRead(m));
      this.selectedChatId = this.messages[0]?.chatId;
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

    setTimeout(()=> {
      this.scrollToBottom();
    }, 0);

  }

  public scrollToBottom(): void {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.scrollToBottom(0, 500);
    }
  }

  public sendMessage(): void {
    this.onSendMessage();

    this.scrollToBottom();
    this.messages = this.userChatMessageMap.get(this.recipient.id) as ChatMessage[];
  }

  private onSendMessage(): void {
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

  public isSendButtonVisible(): boolean {
    return !!this.recipient.id;

  }

  public isSendButtonEnabled(): boolean {
    return this.chatMessageToSend.content.trim() !== '' && this.isSendButtonVisible()
  }

  private playSound(): void {
    let audio = new Audio('assets/sounds/send-message-effect.mp3');
    audio.play();
  }

  public onUserChangeStatus() {
    this.getUserChatStatusMap();
  }

  public isUserOnline(user: User): boolean {
    return this.userChatStatusMap.get(user.id) === 20;
  }

  public getUnreadMessageCount(user: User): number {
    let userChatMessages = this.userChatMessageMap.get(user.id);
    let count = 0;
    if (userChatMessages) {
      for (let chatMessage of userChatMessages) {
        if (chatMessage.status !== ChatMessageStatus.READ && chatMessage.senderId !== this.currentUser.id) {
          count++;
        }
      }
    }

    return count;
  }

}
