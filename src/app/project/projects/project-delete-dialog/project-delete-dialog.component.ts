import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";

@Component({
  selector: 'app-position-delete-dialog',
  templateUrl: './project-delete-dialog.component.html',
  styleUrls: []
})
export class ProjectDeleteDialogComponent {

  public local_data: any;
  constructor(public dialogRef: MatDialogRef<ProjectDeleteDialogComponent>,
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
