export class UserSettings {
  id: string;
  enableChatNotificationSound: boolean;
  themeColor: number;

  constructor() {
    this.id = '';
    this.enableChatNotificationSound = false;
    this.themeColor = 10;
  }
}
