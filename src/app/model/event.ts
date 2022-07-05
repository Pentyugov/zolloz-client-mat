import {CalendarEvent} from "angular-calendar";
import {startOfDay} from 'date-fns';
import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";
import {User} from "./user";
import {CalendarConfig} from "../modules/shared/config/calendar.config";


export class ZollozCalendarEvent extends Entity implements CalendarEvent {

  static readonly TYPE_TASK: number = 10;
  static readonly TYPE_MEETING: number = 20;
  static readonly TYPE_CUSTOM: number = 30;
  static readonly COLOR_PRIMARY = '#247ba0';
  static readonly COLOR_SECONDARY = '#D1E8FF';

  user: User;
  type: number;
  start: Date;
  end?: Date;
  title: string;
  color?: {
    primary: string;
    secondary: string;
  };
  actions?: ZollozCalendarEventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: {
    location: string;
    notes: string;
  };

  constructor() {
    super(ApplicationConstants.CALENDAR_EVENT);
    this.type = ZollozCalendarEvent.TYPE_CUSTOM;
    this.user = new User();
    this.start = new Date();
    this.title = '';
    this.actions = [];
    this.color = CalendarConfig.color.blue;
  }

  public static fillFromData(data: any): ZollozCalendarEvent {
    let calendarEvent = new ZollozCalendarEvent();

    data = data || {};
    calendarEvent.start = new Date(data.start) || startOfDay(new Date());
    calendarEvent.end = new Date(data.end);
    calendarEvent.id = data._id || '';
    calendarEvent.type = ZollozCalendarEvent.TYPE_CUSTOM;
    calendarEvent.title = data.title || '';
    calendarEvent.color = {
      primary: (data.color && data.color.primary) || ZollozCalendarEvent.COLOR_PRIMARY,
      secondary: (data.color && data.color.secondary) || ZollozCalendarEvent.COLOR_SECONDARY,
    };
    calendarEvent.draggable = data.draggable || true;
    calendarEvent.resizable = {
      beforeStart: (data.resizable && data.resizable.beforeStart) || true,
      afterEnd: (data.resizable && data.resizable.afterEnd) || true,
    };
    calendarEvent.actions = data.actions || [];
    calendarEvent.allDay = data.allDay || false;
    calendarEvent.cssClass = data.cssClass || '';
    calendarEvent.meta = {
      location: (data.meta && data.meta.location) || '',
      notes: (data.meta && data.meta.notes) || '',
    };

    return calendarEvent;
  }

}

export interface ZollozCalendarEventAction {
  id?: string | number;
  name: string;
  label: string;
  cssClass?: string;
  a11yLabel?: string;
  onClick({ event, sourceEvent, }: {
    event: ZollozCalendarEvent;
    sourceEvent: MouseEvent | KeyboardEvent;
  }): any;
}
