import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from '../../service/application.service';
import { EmployeeService } from '../../service/employee.service';
import { TranslateService } from '@ngx-translate/core';
import { Employee } from '../../model/employee';
import { EventNotificationService } from '../../service/event-notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationConstants } from '../../shared/application-constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDeleteDialogComponent } from './employee-delete-dialog/employee-delete-dialog.component';
import { AbstractBrowser } from '../../shared/screens/browser/AbstractBrowser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public columnsToDisplay = ApplicationConstants.EMPLOYEES_TABLE_COLUMNS;
  public dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              private employeeService: EmployeeService,
              private dialog: MatDialog) {
    super(router, translate, eventNotificationService, applicationService);


  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadEmployees(): void {
    this.subscriptions.push(
      this.employeeService.getEmployees().subscribe(
        (response: Employee[]) => {
          this.initDataSource(response);
        }, (errorResponse : HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  private initDataSource(employees: Employee []): void {
    this.dataSource.data = employees;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public openDeleteDialog(employee: Employee) {
    this.dialog.open(EmployeeDeleteDialogComponent, {
      data: employee,
      width: ApplicationConstants.DIALOG_WIDTH
    }).afterClosed().subscribe(response => {
      if (response.event.action === ApplicationConstants.DIALOG_ACTION_DELETE) {
        console.log(response.event.action)
        this.onDeleteEmployee(employee);
      }
    });
  }

  private onDeleteEmployee(employee: Employee): void {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(this.employeeService.deleteEmployee(employee.id).subscribe(() => {
      this.afterCommit('EmployeeDeletedMsg');
      this.loadEmployees();
    }, (errorResponse: HttpErrorResponse) => {
      this.showErrorNotification(errorResponse.error.message);
      this.applicationService.changeRefreshing(false);
    }));
  }


}
