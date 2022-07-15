import {WidgetSettings} from "./widget-settings";

export class UserSettings {
  id: string;
  locale: string;
  enableChatNotificationSound: boolean;
  themeColor: number;
  miniSidebar: boolean;
  darkTheme: boolean;
  widgetSettings: WidgetSettings[];

  constructor() {
    this.id = '';
    this.locale = 'en';
    this.enableChatNotificationSound = false;
    this.themeColor = 10;
    this.miniSidebar = false;
    this.darkTheme = false;
    this.widgetSettings = [];
  }
}
