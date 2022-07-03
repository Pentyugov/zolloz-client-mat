import {AbstractWindow} from "../window/abstract-window";
import {MatTableDataSource} from "@angular/material/table";
import {Entity} from "../../../model/entity";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {MatDialog} from "@angular/material/dialog";
import {EntityService} from "../../../service/entity.service";
import {ScreenService} from "../../../service/screen.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpErrorResponse} from "@angular/common/http";
import {ComponentType} from "@angular/cdk/portal";
import {DeleteDialogComponent} from "../dialog/delete-dialog/delete-dialog.component";
import {ApplicationConstants} from "../application-constants";


export abstract class NewAbstractBrowser<T extends Entity> extends AbstractWindow {

  public paginator: MatPaginator | null = null;
  public sort: MatSort | null = null;
  public dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  public entities: Entity[] = [];
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
                        public editorComponent: ComponentType<any>,
                        public entityService: EntityService<T>,
                        public editor: MatDialog,
                        public screenService: ScreenService) {
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
    this.id = "screen$" + this.constructor.name.replace("Component", "");
  }

  public openEditorByUrl(url: string): void {
    if (this.isActionPermit(this.EDIT_ACTION)) {
      this.router.navigateByUrl(url);
    }
  }

  public loadEntities(): void {
    this.subscriptions.push(
      this.entityService.getAll().subscribe(
        (response: T[]) => {
          this.entities = response;
          this.initDataSource(response);
          this.afterLoadEntities();
        }, (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
        }
      )
    );
  }

  private initDataSource(entities: T[]): void {
    this.dataSource = new MatTableDataSource<T>(entities);
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public afterLoadEntities(): void {
    // override to implement logic after entities loaded
  }

  public openAddDialog(entity: T | null): void {
    this.openDialog(ApplicationConstants.DIALOG_ACTION_ADD, entity);
  }

  public openEditDialog(entity: T | null): void {
    if (this.isActionPermit(this.EDIT_ACTION)) {
      this.openDialog(ApplicationConstants.DIALOG_ACTION_UPDATE, entity);
    }
  }

  public openDialog(action: string, entity: T | null): void {
    let isNewItem = false;
    if (action === ApplicationConstants.DIALOG_ACTION_ADD) {
      isNewItem = true;
    }
    const editor = this.editor.open(this.editorComponent, {
      width: "100%",
      height: "800px",
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        entity: entity,
        isNewItem: isNewItem
      }
    });

    editor.afterClosed().subscribe(() => {
      this.loadEntities();
    });
  }

  public openDeleteDialog(entity: T) {
    this.dialog.open(DeleteDialogComponent, {
      data: entity,
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : ''
    }).afterClosed().subscribe(response => {
      if (response.event.action === ApplicationConstants.DIALOG_ACTION_DELETE) {
        this.onDeleteEntity(this.clickedRow);
      }
    });
  }

  public onDeleteEntity(entity: T): void {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(
      this.entityService.delete(this.clickedRow.id).subscribe(
        () => {
          this.subscriptions.push(this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_SUCCESS).subscribe(m => {
            this.messageTitle = m;
          }));

          this.subscriptions.push(this.translate.get('Entity.Deleted.Msg.Success').subscribe(m => {
            this.message = m;
          }));
          this.loadEntities();
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showSuccessNotification(this.messageTitle, this.message);
        }, (errorResponse: HttpErrorResponse) => {
          this.subscriptions.push(this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => {
            this.messageTitle = m;
          }));

          this.loadEntities();
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showErrorNotification(this.messageTitle, errorResponse.error.message);
        }
      )
    )
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

}
