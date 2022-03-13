import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";

@Component({
  selector: 'app-position-add-dialog',
  templateUrl: './position-add-dialog.component.html',
  styleUrls: []
})
export class PositionAddDialogComponent {

  public local_data: any;
  constructor(public dialogRef: MatDialogRef<PositionAddDialogComponent>,
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
