import {Inject, Optional} from "@angular/core";
import {ApplicationConstants} from "../application-constants";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


export abstract class AbstractDialog {

  public inputWidth = 'width: ' + ApplicationConstants.DIALOG_WIDTH;
  public action: string | null = null;
  public local_data: any;

  protected constructor(public dialogRef: MatDialogRef<AbstractDialog>,
                        @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.local_data = {...data}
  }

  doAction(): void {
    this.dialogRef.close({
      event: this.action, data: this.local_data
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }

}
