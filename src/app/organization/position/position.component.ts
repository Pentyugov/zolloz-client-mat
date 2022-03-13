import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractBrowser} from '../../shared/screens/browser/AbstractBrowser';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventNotificationService} from '../../service/event-notification.service';
import {ApplicationService} from '../../service/application.service';
import {PositionService} from "../../service/position.service";
import {Position} from "../../model/position";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {PositionDeleteDialogComponent} from "./position-delete-dialog/position-delete-dialog.component";

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public columnsToDisplay = ApplicationConstants.POSITION_TABLE_COLUMNS;
  public dataSource: MatTableDataSource<Position> = new MatTableDataSource<Position>([]);
  public positions: Position[] = [];

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              private positionService: PositionService,
              private dialog: MatDialog) {
    super(router, translate, eventNotificationService, applicationService)
  }

  ngOnInit(): void {
    this.loadPositions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadPositions(): void {
    this.subscriptions.push(
      this.positionService.getPositions().subscribe(
        (response: Position[]) => {
          this.positions = response;
          this.initDataSource(response);
        }, (errorResponse : HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }));
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  public openDeleteDialog(position: Position) {
    this.dialog.open(PositionDeleteDialogComponent, {
      data: position,
      width: ApplicationConstants.DIALOG_WIDTH
    }).afterClosed().subscribe(response => {
      if (response.event.action === ApplicationConstants.DIALOG_ACTION_DELETE) {
        console.log(response.event.action)
        this.onDeletePosition(position);
      }
    });
  }

  private onDeletePosition(position: Position): void {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(this.positionService.deletePosition(position.id).subscribe(() => {
      this.afterCommit('PositionDeletedMsg');
      this.loadPositions();
    }, (errorResponse: HttpErrorResponse) => {
      this.showErrorNotification(errorResponse.error.message);
      this.applicationService.changeRefreshing(false);
    }));
  }

  private initDataSource(employees: Position []): void {
    this.dataSource.data = employees;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


}
