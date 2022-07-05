import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {CalendarConfig} from "../../../shared/config/calendar.config";
import {FormControl} from "@angular/forms";
import {ZollozCalendarEvent} from "../../../../model/event";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {AbstractEditor} from "../../../shared/editor/abstract-editor";
import {Router} from "@angular/router";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {ApplicationService} from "../../../../service/application.service";
import {CalendarService} from "../../../../service/calendar.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationConstants} from "../../../shared/application-constants";
import {SaveDialogComponent} from "../../../shared/dialog/save-dialog/save-dialog.component";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.scss']
})
export class CalendarEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  @ViewChild('startDate') startDate: any;
  @ViewChild('andDate') andDate: any;

  public calendarConfig: CalendarConfig = new CalendarConfig();

  public startDateForm: FormControl = new FormControl(new Date());
  public endDateForm: FormControl = new FormControl(new Date());

  public entity: ZollozCalendarEvent = new ZollozCalendarEvent();
  public _data: any;

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private calendarService: CalendarService,
              public dialogRef: MatDialogRef<CalendarEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    super(router, translate, eventNotificationService, applicationService, dialog);
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this._data = data;
  }

  ngOnInit(): void {
    if (!this.isNewItem()) {
      this.entity = this._data.entity;
      this.reloadEvent();
    } else {
      this.prepareDate();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public reloadEvent(): void {
    this.subscriptions.push(this.calendarService.getById(this.entity.id).subscribe(
      (response: ZollozCalendarEvent) => {
        this.entity = response;
        this.startDateForm = new FormControl(new Date(this.entity.start));
        this.endDateForm = new FormControl(new Date(this.entity.end!));
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message)
      }));
  }

  public close() {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_SAVE
      }
    });
  }

  public openSaveDialog() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : ''
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
          if (this.isNewItem()) {
            this.onCreateEvent();
          } else {
            this.onUpdateEvent();
          }

        }
      }
    });
  }

  private onCreateEvent(): void {
    this.subscriptions.push(this.calendarService.add(this.entity).subscribe(
      () => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Event was created successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      }));
    this.close();
  }

  public onUpdateEvent(): void {
    this.subscriptions.push(this.calendarService.update(this.entity).subscribe(
      () => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Event was updated successfully`);
        this.close();
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        this.close();
      }));
  }

  public isNewItem(): boolean {
    return this._data.isNewItem;
  }

  public isItemEditable(): boolean {
    return this.entity.type === ZollozCalendarEvent.TYPE_CUSTOM;
  }

  private prepareDate(): void {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    endDate.setMinutes(30);
    endDate.setSeconds(0);

    this.startDateForm = new FormControl(startDate);
    this.endDateForm = new FormControl(endDate);
  }







}
