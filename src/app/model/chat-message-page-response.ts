import {ChatMessage} from "./chat-message";

export class chatMessagePageResponse {
  totalPages: number;
  messages: ChatMessage[];

  constructor() {
    this.totalPages = 0;
    this.messages = [];
  }
}
