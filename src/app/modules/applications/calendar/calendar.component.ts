import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {CalendarFormDialogComponent} from "./calendar-form-dialog/calendar-form-dialog.component";
import {DOCUMENT} from "@angular/common";
import {CalendarEvent} from "angular-calendar";
import {addHours, isSameDay, isSameMonth, startOfDay,} from 'date-fns';
import {CalendarDialogComponent} from "./calendar-dialog/calendar-dialog.component";
import {Subject, Subscription} from "rxjs";
import {CalendarService} from "../../../service/calendar.service";
import {ZollozCalendarEvent, ZollozCalendarEventAction} from "../../../model/event";

const colors: any = {
  red: {
    primary: '#fc4b6c',
    secondary: '#f9e7eb',
  },
  blue: {
    primary: '#1e88e5',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#ffb22b',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  private subscriptions: Subscription[] = [];
  dialogRef: MatDialogRef<CalendarDialogComponent> = Object.create(null);
  dialogRef2: MatDialogRef<CalendarFormDialogComponent> = Object.create(null)

  view = 'month';
  viewDate: Date = new Date();

  activeDayIsOpen = true;

  lastCloseResult = '';
  refresh: Subject<any> = new Subject();

  config: MatDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    data: {
      action: '',
      event: [],
    },
  };

  actions: ZollozCalendarEventAction[] = [
    {
      label: '<i class="fa fa-eye act"></i>',
      onClick: ({ event }: { event: ZollozCalendarEvent }): void => {
        this.handleEvent('Open', event);
      },
    },
    {
      label: '<i class="ti-pencil act"></i>',
      onClick: ({ event }: { event: ZollozCalendarEvent }): void => {
        this.handleEvent('Edit', event);
      },
    },
    {
      label: '<i class="ti-close act"></i>',
      onClick: ({ event }: { event: ZollozCalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date()),
      end: addHours(startOfDay(new Date()), 2),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }
  ];


  constructor(public dialog: MatDialog,
              public calendarService: CalendarService,
              @Inject(DOCUMENT) doc: any) {

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  public handleEvent(action: string, event: ZollozCalendarEvent): void {
    this.config.data = { event, action };
    this.dialogRef = this.dialog.open(CalendarDialogComponent, this.config);

    this.dialogRef.afterClosed().subscribe((result: string) => {
      this.lastCloseResult = result;
      this.dialogRef = Object.create(null);
      this.refresh.next(result);
      // this.onUpdateCalendarEvent(event);

    });
  }

  public addEvent(): void {
    this.dialogRef2 = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      data: {
        action: 'add',
        date: new Date(),
      },
    });
    this.dialogRef2.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      const dialogAction = res.action;
      const responseEvent = res.event;
      responseEvent.actions = this.actions;
      this.events.push(responseEvent);
      this.dialogRef2 = Object.create(null);
      this.refresh.next(responseEvent);
      // this.onAddCalendarEvent(responseEvent);
    });
  }

  public eventTimesChanged({ event, newStart, newEnd }: any): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  private onAddCalendarEvent(event: ZollozCalendarEvent): void {
    event.actions = [];
    this.subscriptions.push(
      this.calendarService.add(event).subscribe(()=> {
        console.log('created');
      })
    );
  }

  private onUpdateCalendarEvent(event: ZollozCalendarEvent): void {
    event.actions = [];
    this.subscriptions.push(
      this.calendarService.update(event).subscribe(()=> {
        console.log('updated');
      })
    );
  }

}
