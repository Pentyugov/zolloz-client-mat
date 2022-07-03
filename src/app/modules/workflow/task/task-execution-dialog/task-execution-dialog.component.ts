import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";

@Component({
  selector: 'app-task-execution-dialog',
  templateUrl: './task-execution-dialog.component.html',
  styleUrls: []
})
export class TaskExecutionDialogComponent {

  public local_data: any;
  public caption: string = '';
  public message: string = '';
  public comment: string = '';
  constructor(public dialogRef: MatDialogRef<TaskExecutionDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data}
    this.caption = this.local_data.caption;
    this.message = this.local_data.message;
  }

  public closeDialog(): void {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_CANCEL
      }
    });
  }

  public doAction(): void {
    this.dialogRef.close({
      event: {
        comment: this.comment,
        action: ApplicationConstants.DIALOG_ACTION_APPLY,
      }
    });
  }

}
