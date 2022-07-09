import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../application-constants";

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent {
  constructor(public translate: TranslateService,
              public dialogRef: MatDialogRef<SaveDialogComponent>) {

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
