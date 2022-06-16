import {User} from "./user";

export class ChatMessage {
  public static readonly SEND: number = 10;
  public static readonly RECEIVED: number = 20;
  public static readonly READ: number = 30;

  id: string;
  content: string;
  status: number;
  senderId: string;
  sender: User;
  recipientId: string;
  recipient: User;
  chatId: string;
  createDate: Date;

  constructor() {
    this.id = '';
    this.content = '';
    this.status = 0;
    this.chatId = '';
    this.senderId ='';
    this.sender = new User();
    this.recipientId = '';
    this.recipient = new User();
    this.createDate = new Date();
  }
}
