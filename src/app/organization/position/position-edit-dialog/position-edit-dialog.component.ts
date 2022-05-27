import {Component, Inject, OnInit, Optional} from '@angular/core';
import {AbstractDialog} from "../../../shared/screens/dialog/abstractDialog";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";

@Component({
  selector: 'app-position-edit-dialog',
  templateUrl: './position-edit-dialog.component.html',
  styleUrls: []
})
export class PositionEditDialogComponent extends AbstractDialog implements OnInit {


  constructor(public override dialogRef: MatDialogRef<PositionEditDialogComponent>,
                     @Optional() @Inject(MAT_DIALOG_DATA) public override data: any) {
    super(dialogRef, data);
  }

  ngOnInit(): void {
    this.action = ApplicationConstants.DIALOG_ACTION_SAVE;
  }



}
