import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CalendarEvent} from 'angular-calendar';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ZollozCalendarEvent} from "../../../../model/event";
import {TranslateService} from "@ngx-translate/core";
import {CalendarConfig} from "../../../shared/config/calendar.config";

interface DialogData {
  event?: CalendarEvent;
  action?: string;
  date?: Date;
}

@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss'],
})
export class CalendarFormDialogComponent {
  @ViewChild('startDate') startDate: any;
  @ViewChild('andDate') andDate: any;

  public calendarConfig: CalendarConfig = new CalendarConfig();
  public startDateForm = new FormControl(new Date().setMinutes(0));
  public endDateForm = new FormControl(new Date().setMinutes(0));

  event: any;
  dialogTitle: string;
  eventForm: FormGroup;
  action: any;

  constructor(public dialogRef: MatDialogRef<CalendarFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: DialogData,
              public translate: TranslateService,
              private formBuilder: FormBuilder) {
    this.prepareDate();
    this.event = data.event;
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = this.event.title;
    } else {
      this.dialogTitle = 'Add Event';
      this.event = ZollozCalendarEvent.fillFromData(data);
    }
    this.eventForm = this.buildEventForm(this.event);
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

  buildEventForm(event: any): any {
    return new FormGroup({
      _id:   new FormControl(event._id),
      type:  new FormControl(event.type),
      title: new FormControl(event.title),
      start: this.startDateForm,
      end:   this.endDateForm,
      allDay: new FormControl(event.allDay),
      color: this.formBuilder.group({
        primary: new FormControl(event.color.primary),
        secondary: new FormControl(event.color.secondary),
      }),
      meta: this.formBuilder.group({
        location: new FormControl(event.meta.location),
        notes: new FormControl(event.meta.notes),
      }),

      resizable: this.formBuilder.group({
        beforeStart: new FormControl(true),
        afterEnd: new FormControl(true),
      }),

      draggable: new FormControl(true),
    });
  }
}
