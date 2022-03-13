import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";

@Component({
  selector: 'app-position-delete-dialog',
  templateUrl: './position-delete-dialog.component.html',
  styleUrls: []
})
export class PositionDeleteDialogComponent {

  public local_data: any;
  constructor(public dialogRef: MatDialogRef<PositionDeleteDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data}
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
        action: ApplicationConstants.DIALOG_ACTION_DELETE
      }
    });
  }

}
