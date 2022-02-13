export class UserSettings {
  id: string;
  locale: string;
  enableChatNotificationSound: boolean;
  themeColor: number;
  miniSidebar: boolean;
  darkTheme: boolean;

  constructor() {
    this.id = '';
    this.locale = 'en';
    this.enableChatNotificationSound = false;
    this.themeColor = 10;
    this.miniSidebar = false;
    this.darkTheme = false;
  }
}
