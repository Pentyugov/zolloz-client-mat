import {Component, Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {ZollozCalendarEvent} from "../../../../model/event";
import {ThemePalette} from "@angular/material/core";
import * as moment from 'moment';
import {TranslateService} from "@ngx-translate/core";

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

  public date: moment.Moment | undefined;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment | undefined;
  public maxDate: moment.Moment | undefined;
  public stepHour = 1;
  public stepMinute = 30;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public startDateForm = new FormControl(new Date());
  public endDateForm = new FormControl(new Date());

  event: any;
  dialogTitle: string;
  eventForm: FormGroup;
  action: any;

  constructor(public dialogRef: MatDialogRef<CalendarFormDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: DialogData,
              public translate: TranslateService,
              private formBuilder: FormBuilder) {
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
      draggable: new FormControl(true),
    });
  }
}
