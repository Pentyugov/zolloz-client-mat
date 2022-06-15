import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Department} from "../../../../model/department";
import {ApplicationConstants} from "../../../../shared/application-constants";

@Component({
  selector: 'app-department-save-dialog',
  templateUrl: './department-save-dialog.component.html',
  styleUrls: ['./department-save-dialog.component.scss']
})
export class DepartmentSaveDialogComponent {
  action: string;
  local_data: any;

  constructor(public dialogRef: MatDialogRef<DepartmentSaveDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Department) {
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_SAVE
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }
}
