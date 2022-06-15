import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../../shared/application-constants";

@Component({
  selector: 'app-position-add-dialog',
  templateUrl: './position-add-dialog.component.html',
  styleUrls: []
})
export class PositionAddDialogComponent {

  inputWidth = 'width: ' + ApplicationConstants.DIALOG_WIDTH;
  public action: string | null = null;
  public local_data: any;
  constructor(public dialogRef: MatDialogRef<PositionAddDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data}
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_ADD, data: this.local_data
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }

}
