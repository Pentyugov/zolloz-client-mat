import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {ApplicationService} from "../../../../service/application.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Contractor} from "../../../../model/contractor";
import {ApplicationConstants} from "../../../shared/application-constants";
import {SaveDialogComponent} from "../../../shared/dialog/save-dialog/save-dialog.component";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {ContractorService} from "../../../../service/contractor.service";
import {AbstractEditor} from "../../../shared/editor/abstract-editor";

@Component({
  selector: 'app-contrator-edit',
  templateUrl: './contractor-edit.component.html',
  styleUrls: ['./contractor-edit.component.scss']
})
export class ContractorEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  public dialog_data: any;
  public entity: Contractor = new Contractor();
  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              public contractorService: ContractorService,
              public dialogRef: MatDialogRef<ContractorEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    super(router, translate, eventNotificationService, applicationService, dialog);
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this.dialog_data = data;
  }

  ngOnInit(): void {
    if (!this.isNewItem()) {
      this.entity = this.data.entity;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public openSaveDialog() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : ''
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
          if (this.isNewItem()) {
            this.onCreateEntity();
          } else {
            this.onUpdateEntity();
          }
        }
      }
    });
  }

  private onCreateEntity(): void {
    this.subscriptions.push(this.contractorService.add(this.entity).subscribe(
      () => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Contractor was created successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      }));
    this.close();
  }

  public onUpdateEntity(): void {
    this.subscriptions.push(this.contractorService.update(this.entity).subscribe(
      () => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Contractor was updated successfully`);
        this.close();
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        this.close();
      }));
  }

  public close() {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_SAVE
      }
    });
  }

  public isNewItem(): boolean {
    return this.dialog_data.isNewItem;
  }

}
