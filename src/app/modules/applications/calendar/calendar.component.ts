import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DOCUMENT} from "@angular/common";
import {CalendarEvent} from "angular-calendar";
import {isSameDay, isSameMonth,} from 'date-fns';
import {Subject} from "rxjs";
import {CalendarService} from "../../../service/calendar.service";
import {ZollozCalendarEvent, ZollozCalendarEventAction} from "../../../model/event";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NewAbstractBrowser} from "../../shared/browser/new-abstract.browser";
import {ScreenService} from "../../../service/screen.service";
import {CalendarEditComponent} from "./calendar-edit/calendar-edit.component";
import {ApplicationConstants} from "../../shared/application-constants";

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
export class CalendarComponent extends NewAbstractBrowser<ZollozCalendarEvent> implements OnInit, OnDestroy {

  dialogRef: MatDialogRef<CalendarEditComponent> = Object.create(null)

  view = 'month';
  viewDate: Date = new Date();

  activeDayIsOpen = true;

  refresh: Subject<any> = new Subject();

  actions: ZollozCalendarEventAction[] = [
    {
      label: '<i class="fa fa-eye act"></i>',
      name: 'open',
      onClick: ({event}: { event: ZollozCalendarEvent }): void => {
        this.handleEvent('Open', event);
      },
    },
    {
      label: '<i class="ti-pencil act"></i>',
      name: 'edit',
      onClick: ({event}: { event: ZollozCalendarEvent }): void => {
        this.handleEvent('Edit', event);
      },
    },
    {
      label: '<i class="ti-close act"></i>',
      name: 'delete',
      onClick: ({event}: { event: ZollozCalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Delete', event);
      },
    },
  ];

  public events: ZollozCalendarEvent[] = [];

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              public calendarService: CalendarService,
              @Inject(DOCUMENT) doc: any) {
    super(router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      CalendarEditComponent,
      calendarService,
      editor,
      screenService);
  }

  ngOnInit(): void {
    this.loadCalendarEvents();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  public dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
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
    if (action === 'open') {
      this.openEditDialog(event);
    }

  }

  public override openAddDialog(entity: ZollozCalendarEvent | null): void {
    this.openDialog(ApplicationConstants.DIALOG_ACTION_ADD, entity);
  }

  public override openEditDialog(entity: ZollozCalendarEvent | null): void {
    this.openDialog(ApplicationConstants.DIALOG_ACTION_UPDATE, entity);
  }

  public override openDialog(action: string, entity: ZollozCalendarEvent | null): void {
    let isNewItem = false;
    if (action === ApplicationConstants.DIALOG_ACTION_ADD) {
      isNewItem = true;
    }
    const editor = this.editor.open(this.editorComponent, {
      panelClass: this.isDarkMode ? 'dark' : 'calendar-form-dialog',
      data: {
        entity: entity,
        isNewItem: isNewItem
      }
    });

    editor.afterClosed().subscribe(() => {
        this.loadCalendarEvents();
    });
  }

  public openEditor(event: ZollozCalendarEvent | null): void {
    this.dialogRef = this.dialog.open(CalendarEditComponent, {
      panelClass: 'calendar-form-dialog',
      data: {
        event: event,
        action: 'add',
        date: new Date(),
      },
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      const event = result.event;
      event.actions = this.actions;
      this.events.push(event);
      this.dialogRef = Object.create(null);
      this.refresh.next(event);
    });
  }

  public eventTimesChanged({event, newStart, newEnd}: any): void {
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
    this.handleEvent('update', event);
  }

  private loadCalendarEvents(): void {
    this.subscriptions.push(
      this.calendarService.getAllForCurrentUser().subscribe((response: ZollozCalendarEvent[]) => {
        this.events = response;
        this.setAllowedActionForEvents();
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
      })
    );
  }

  private setAllowedActionForEvents(): void {
    this.events.forEach(e => {
      if (e.type === ZollozCalendarEvent.TYPE_CUSTOM) {
        e.actions = this.actions;
      } else {
        const openAction = this.getAction('open');
        if (openAction) {
          e.actions = [];
          e.actions.push(openAction)
        }
      }
    });
  }

  private getAction(name: string): ZollozCalendarEventAction | undefined {
    let action;

    this.actions.forEach(a => {
      if (a.name === name) {
        action = a;
      }
    });

    return action;
  }

}
