import {Component, Inject, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DOCUMENT} from "@angular/common";
import {CalendarDateFormatter, CalendarEvent, DAYS_OF_WEEK} from 'angular-calendar';
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
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {CustomDateFormatter} from "./custom-date-formatter.provider";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarComponent extends NewAbstractBrowser<ZollozCalendarEvent> implements OnInit, OnDestroy {
  @Input() public isWidget: boolean = false;
  public editAction = ApplicationConstants.SCREEN_ACTION_EDIT;
  public deleteAction = ApplicationConstants.SCREEN_ACTION_DELETE;
  public updateAction = ApplicationConstants.SCREEN_ACTION_UPDATE;
  dialogRef: MatDialogRef<CalendarEditComponent> = Object.create(null)
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen = false;
  refresh: Subject<any> = new Subject();
  locale: string = 'ru';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;


  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  actions: ZollozCalendarEventAction[] = [
    {
      label: '<i class="ti-pencil act"></i>',
      name: this.editAction,
      onClick: ({event}: { event: ZollozCalendarEvent }): void => {
        this.handleEvent(this.editAction, event);
      },
    },
    {
      label: '<i class="ti-close act"></i>',
      name: this.deleteAction,
      onClick: ({event}: { event: ZollozCalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent(this.deleteAction, event);
      },
    },
  ];

  public events: ZollozCalendarEvent[] = [];

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              public calendarService: CalendarService,
              @Inject(DOCUMENT) doc: any) {
    super(injector,
      router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      CalendarEditComponent,
      calendarService,
      editor,
      screenService);

    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.locale = us.locale;
    }));

  }

  ngOnInit(): void {
    this.loadEntities();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  public dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
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
    if (action === this.editAction) {
      this.openEditDialog(event);
    }
    if (action === this.deleteAction) {
      this.openDeleteDialog(event);
    }
    if (action === this.updateAction) {
      this.onUpdateEvent(event);
    }
  }

  public override openAddDialog(entity: ZollozCalendarEvent | null): void {
    this.openDialog(ApplicationConstants.DIALOG_ACTION_ADD, entity);
  }

  public override openEditDialog(entity: ZollozCalendarEvent | null): void {
    this.openDialog(ApplicationConstants.DIALOG_ACTION_UPDATE, entity);
  }

  public override openDialog(action: string, entity: ZollozCalendarEvent | null): void {
    if (this.editorComponent) {
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
        this.loadEntities();
      });
    }

  }

  private onUpdateEvent(event: ZollozCalendarEvent): void {
    event.actions = [];
    this.subscriptions.push(this.calendarService.update(event).subscribe(
      () => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Event was updated successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      }));
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
    this.handleEvent(this.updateAction, event);
  }

  public updateData(update: boolean): void {
    if (update) {
      this.loadEntities();
    }
  }

  public override loadEntities(): void {
    this.subscriptions.push(
      this.calendarService.getAllForCurrentUser().subscribe((response: ZollozCalendarEvent[]) => {
        this.events = this.convertEvents(response);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
      })
    );
  }

  private convertEvents(events: ZollozCalendarEvent[]): ZollozCalendarEvent[] {
    events.forEach(e => {
      e.start = new Date(e.start);
      e.end = new Date(e.end!);
      if (e.type === ZollozCalendarEvent.TYPE_CUSTOM) {
        e.actions = this.actions;
      } else {
        const openAction = this.getAction(this.editAction);
        if (openAction) {
          e.actions = [];
          e.actions.push(openAction)
        }
      }
    });

    return events;
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
