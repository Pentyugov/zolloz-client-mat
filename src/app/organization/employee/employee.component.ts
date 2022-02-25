import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {ApplicationService} from "../../service/application.service";
import {EmployeeService} from "../../service/employee.service";
import {TranslateService} from "@ngx-translate/core";
import {Employee} from "../../model/employee";
import {EventNotificationService} from "../../service/event-notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {EventNotificationCaptionEnum} from "../../enum/event-notification-caption.enum";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styles: [
  ]
})
export class EmployeeComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public refreshing: boolean = false;
  public columnsToDisplay = ApplicationConstants.EMPLOYEES_TABLE_COLUMNS;
  public dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  private subscriptions: Subscription[] = [];


  constructor(private applicationService: ApplicationService,
              private employeeService: EmployeeService,
              private translate: TranslateService,
              private eventNotificationService: EventNotificationService) {

    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));

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

  private showErrorNotification(message: string): void {
    this.subscriptions.push(this.translate.get(EventNotificationCaptionEnum.ERROR).subscribe(title => {
      this.eventNotificationService.showErrorNotification(title, message);
    }));
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

  openDialog(element: any) {

  }
}
