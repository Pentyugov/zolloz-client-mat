export class UserSettings {
  id: string;
  enableChatNotificationSound: boolean;
  themeColor: number;
  miniSidebar: boolean;
  darkTheme: boolean;

  constructor() {
    this.id = '';
    this.enableChatNotificationSound = false;
    this.themeColor = 10;
    this.miniSidebar = false;
    this.darkTheme = false;
  }
}
