import {Component, Inject} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.scss']
})
export class CalendarDialogComponent {

  options!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CalendarDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

}
