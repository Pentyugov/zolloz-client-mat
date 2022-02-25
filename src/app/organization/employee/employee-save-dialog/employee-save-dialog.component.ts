import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";

@Component({
  selector: 'app-employee-save-dialog',
  templateUrl: './employee-save-dialog.component.html',
  styleUrls: []
})
export class EmployeeSaveDialogComponent implements OnInit {
  public local_data: any;
  constructor(public dialogRef: MatDialogRef<EmployeeSaveDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data}
  }

  ngOnInit(): void {
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
        action: ApplicationConstants.DIALOG_ACTION_SAVE
      }
    });
  }
}
