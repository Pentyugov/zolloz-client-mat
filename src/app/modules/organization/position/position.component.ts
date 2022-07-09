import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EventNotificationService} from '../../../service/event-notification.service';
import {ApplicationService} from '../../../service/application.service';
import {PositionService} from "../../../service/position.service";
import {Position} from "../../../model/position";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {PositionDeleteDialogComponent} from "./position-delete-dialog/position-delete-dialog.component";
import {PositionAddDialogComponent} from "./position-add-dialog/position-add-dialog.component";
import {EventNotificationCaptionEnum} from "../../../enum/event-notification-caption.enum";
import {PositionEditDialogComponent} from "./position-edit-dialog/position-edit-dialog.component";
import {ScreenService} from "../../../service/screen.service";
import {Employee} from "../../../model/employee";
import {EmployeeService} from "../../../service/employee.service";
import {AbstractBrowser} from "../../shared/browser/AbstractBrowser";

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  @ViewChild(MatPaginator, { static: false }) employeePaginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) employeeSort: MatSort = Object.create(null);

  public columnsToDisplay = ApplicationConstants.POSITION_TABLE_COLUMNS;
  public employeeDisplayedColumns = ['number', 'personnelNumber', 'firstName', 'lastName'];
  public employeeDs: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  public dataSource: MatTableDataSource<Position> = new MatTableDataSource<Position>([]);
  public positions: Position[] = [];
  public employees: Employee[] = [];

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              screenService: ScreenService,
              dialog: MatDialog,
              private positionService: PositionService,
              private employeeService: EmployeeService) {
    super(router, translate, eventNotificationService, applicationService, dialog, screenService);
    this.id = 'screen$Position'
  }

  ngOnInit(): void {
    this.loadPositions();
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadPositions(): void {
    this.subscriptions.push(
      this.positionService.getAll().subscribe(
        (response: Position[]) => {
          this.positions = response;
          this.initDataSource(response);
        }, (errorResponse : HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }));
  }

  public loadEmployees(): void {
    this.subscriptions.push(
      this.employeeService.getAll().subscribe(
        (response: Employee[]) => {
          this.updateEmployeesDs(response)
          this.employees = response;
        }, (errorResponse : HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }));
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  public applyEmployeeFilter(value: any) {
    if (this.employeeDs) {
      this.employeeDs.filter = value.trim().toLowerCase();
    }
  }

  public openDeleteDialog(position: Position) {
    this.dialog.open(PositionDeleteDialogComponent, {
      data: position,
      panelClass: this.isDarkMode ? 'dark' : '',
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
    this.subscriptions.push(this.positionService.delete(position.id).subscribe(() => {
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

  public openPositionAddDialog() {
    const dialogRef = this.dialog.open(PositionAddDialogComponent, {
      data: {'action' : ApplicationConstants.DIALOG_ACTION_ADD},
      panelClass: this.isDarkMode ? 'dark' : '',
      width: ApplicationConstants.DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_ADD) {
        this.onCreatePosition(result.data);
      }
    });
  }

  public openPositionEditDialog(position: Position) {
    if (this.isActionPermit(this.EDIT_ACTION)) {
      const dialogRef = this.dialog.open(PositionEditDialogComponent, {
        data: position,
        panelClass: this.isDarkMode ? 'dark' : '',
        width: ApplicationConstants.DIALOG_WIDTH
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
          this.onUpdatePosition(result.data);
        }
      });
    }

  }

  private onUpdatePosition(position: Position): void {
    if (position) {
      this.positionService.update(position).subscribe(
        (response: Position) => {
          this.loadPositions()
          this.eventNotificationService
            .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Position: ${response.name} was updated successfully`);
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        });
    }
  }

  private onCreatePosition(position: Position): void {
    if (position) {
      this.positionService.add(position).subscribe(
        (response: Position) => {
          this.loadPositions()
          this.eventNotificationService
            .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Position: ${response.name} was added successfully`);
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        });
    }
  }

  public override onClickRow(row: any): void {
    this.clickedRow = row;

    let tmp: Employee[] = [];
    this.employees.forEach(employee => {
      if (employee.position?.id === row.id)
        tmp.push(employee);
    })
    this.updateEmployeesDs(tmp);

  }

  private updateEmployeesDs(employees: Employee[]): void {
    this.employeeDs = new MatTableDataSource<Employee>(employees);
    this.employeeDs.paginator = this.employeePaginator;
    this.employeeDs.sort = this.employeeSort;
  }

}
