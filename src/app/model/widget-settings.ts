export class WidgetSettings {
  public static readonly WIDGET_CALENDAR_TYPE = 10;
  public static readonly WIDGET_ACTIVE_TASKS_TYPE = 20;
  public static readonly WIDGET_PRODUCTIVITY_TYPE = 30;

  type: number;
  visible: boolean;
  bucket: number;
  index: number;

  constructor() {
    this.type = 0;
    this.visible = true;
    this.bucket = 0;
    this.index = 0;
  }
}
