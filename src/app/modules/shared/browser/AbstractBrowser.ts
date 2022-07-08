import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventNotificationService} from '../../../service/event-notification.service';
import {ApplicationService} from '../../../service/application.service';
import {ScreenService} from "../../../service/screen.service";
import {AbstractWindow} from "../window/abstract-window";
import {MatDialog} from "@angular/material/dialog";
import {ApplicationConstants} from "../application-constants";

export abstract class AbstractBrowser extends AbstractWindow {

  public selectedRow: any;
  public clickedRow: any;
  public id: string = '';
  public readonly CREATE_ACTION =ApplicationConstants.SCREEN_ACTION_CREATE;
  public readonly BROWSE_ACTION =ApplicationConstants.SCREEN_ACTION_BROWSE;
  public readonly EDIT_ACTION =ApplicationConstants.SCREEN_ACTION_EDIT;
  public readonly DELETE_ACTION =ApplicationConstants.SCREEN_ACTION_DELETE;

  protected constructor(router: Router,
                        translate: TranslateService,
                        eventNotificationService: EventNotificationService,
                        applicationService: ApplicationService,
                        dialog: MatDialog,
                        protected screenService: ScreenService) {
    super(router, translate, eventNotificationService, applicationService, dialog);
    this.initId();
  }

  protected afterCommit(message: string): void {
    this.subscriptions.push(
      this.translate.get('Success').subscribe(m => this.messageTitle = m)
    );

    this.subscriptions.push(
      this.translate.get(message).subscribe(m => this.message = m)
    );

    this.applicationService.changeRefreshing(false);
  }

  public getMaxTextLength(text: string, limit: number): string {
    if (text) {
      return text.length > 40 ? text.slice(0, limit) + '...' : text;
    }
    return '';
  }

  public isActionPermit(action: string): boolean {
    return this.screenService.isActionPermit(this.id, action);
  }

  public onEnterRow(row: any): void {
    this.selectedRow = row;
  }

  public onLeaveRow(): void {
    this.selectedRow = null;
  }

  public onClickRow(row: any): void {
    this.clickedRow = row;
  }

  public initId(): void {
    // this.id = "screen$" + this.constructor.name.replace("Component", "");
  }

  public openEditorByUrl(url: string): void {
    if (this.isActionPermit(this.EDIT_ACTION)) {
      this.router.navigateByUrl(url);
    }
  }


}
