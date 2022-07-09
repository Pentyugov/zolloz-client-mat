import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DepartmentService} from "../../../../service/department.service";
import {ApplicationService} from "../../../../service/application.service";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Department} from "../../../../model/department";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Employee} from "../../../../model/employee";
import {MatTableDataSource} from "@angular/material/table";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DepartmentEmployeeAddDialogComponent} from "../department-employee-add-dialog/department-employee-add-dialog.component";
import {DepartmentSaveDialogComponent} from "../department-save-dialog/department-save-dialog.component";
import {EmployeeService} from "../../../../service/employee.service";

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})
export class DepartmentAddComponent implements OnInit, OnDestroy {
  public isDarkMode: boolean = false;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public refreshing = true;
  public department: Department = new Department;
  public subscriptions: Subscription[] = [];
  public departmentList: Department[] = [];
  public employees: Employee[] = [];
  public employeeDs: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  public employeeDisplayedColumns = ['number', 'personnelNumber', 'firstName', 'lastName'];
  public isEmployeeDsChecked: boolean = true;
  private messageTitle: string = '';
  private message: string = '';
  constructor(private departmentService: DepartmentService,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService,
              private translate: TranslateService,
              private employeeService: EmployeeService,
              private dialog: MatDialog,
              public router: Router) {
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => this.translate.use(us.locale)));
    this.subscriptions.push(this.applicationService.refreshing.subscribe(ref => this.refreshing = ref));
    this.subscriptions.push(applicationService.darkMode.subscribe(dm => this.isDarkMode = dm));
    this.subscriptions.push(applicationService.darkMode.subscribe(dm => this.isDarkMode = dm));
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public openSaveDialog(action: string, data: any) {
    this.checkEmployeeDs();
    data.action = action;
    data.isEmployeeDsChecked = this.isEmployeeDsChecked;
    const dialogRef = this.dialog.open(DepartmentSaveDialogComponent, {
      data: data,
      panelClass: this.isDarkMode ? 'dark' : '',
      width: ApplicationConstants.DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
        this.onSaveDepartment();
      }
    });
  }

  public openEmployeeAddDialog(action: string, data: any): void {
    data.action = action;
    data.employees = this.employeeDs.data;
    const dialogRef = this.dialog.open(DepartmentEmployeeAddDialogComponent, {
      data: data,
      panelClass: this.isDarkMode ? 'dark' : '',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event.action === ApplicationConstants.DIALOG_ACTION_SAVE) {
        this.initDataSource(result.event.data);
      }
    });
  }

  public changeHeadValue($event: any): void {
    if ($event.checked) {
      this.department.parentDepartment = null;
    }
  }

  private checkEmployeeDs(): void {
    this.employeeDs.data.forEach(employee => {
      if (employee.department?.id !== this.department.id) {
        this.isEmployeeDsChecked = false;
      }
    })
  }

  private onSaveDepartment(): void {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(
      this.departmentService.add(this.department).subscribe(
        (response: Department) => {
          this.department = response;
          if (this.employeeDs.data.length > 0) {
            this.employeeDs.data.forEach(employee => employee.department = this.department);
            this.updateEmployees();
          } else {
            this.afterCommit();
          }
        }, (errorResponse: HttpErrorResponse) => {
          this.applicationService.changeRefreshing(false);
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private updateEmployees(): void {
    this.subscriptions.push(
      this.employeeService.updateAllEmployees(this.employeeDs.data).subscribe(
        () => {
          this.afterCommit();
        }, (errorResponse: HttpErrorResponse) => {
          this.applicationService.changeRefreshing(false);
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private showErrorNotification(errorMessage: string): void {
    this.subscriptions.push(
      this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => this.messageTitle = m)
    );
    this.eventNotificationService.showErrorNotification(this.messageTitle, errorMessage);
  }

  private afterCommit(): void {
    this.subscriptions.push(
      this.translate.get('Success').subscribe(m => this.messageTitle = m)
    );

    this.subscriptions.push(
      this.translate.get('DepartmentSavedMsg').subscribe(m => this.message = m)
    );

    this.applicationService.changeRefreshing(false);
    this.router.navigateByUrl('/organization/departments').then(() => {
      this.eventNotificationService.showSuccessNotification(this.messageTitle, this.message);
    });
  }

  private loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getAll().subscribe(
        (response: Department[]) => {
          this.departmentList = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.subscriptions.push(
            this.translate.get('Error').subscribe(m => this.messageTitle = m)
          );
          this.eventNotificationService.showErrorNotification(this.messageTitle, errorResponse.error.message);
        })
    );
  }

  private initDataSource(employees: Employee[]): void {
    this.employeeDs = new MatTableDataSource<Employee>(employees);
    this.employeeDs.paginator = this.paginator;
    this.employeeDs.sort = this.sort;
  }

}
