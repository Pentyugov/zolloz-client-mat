import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../../shared/application-constants";

@Component({
  selector: 'app-employee-prefill-dialog',
  templateUrl: './employee-prefill-dialog.component.html',
  styleUrls: []
})
export class EmployeePrefillDialogComponent implements OnInit {
  public local_data: any;
  constructor(public dialogRef: MatDialogRef<EmployeePrefillDialogComponent>,
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
        action: ApplicationConstants.DIALOG_ACTION_APPLY
      }
    });
  }
}
