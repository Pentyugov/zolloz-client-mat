import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Department} from "../../../../model/department";
import {Employee} from "../../../../model/employee";
import {MatTableDataSource} from "@angular/material/table";
import {DepartmentService} from "../../../../service/department.service";
import {ApplicationService} from "../../../../service/application.service";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {EmployeeService} from "../../../../service/employee.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {DepartmentSaveDialogComponent} from "../department-save-dialog/department-save-dialog.component";
import {ApplicationConstants} from "../../../../shared/application-constants";
import {DepartmentEmployeeAddDialogComponent} from "../department-employee-add-dialog/department-employee-add-dialog.component";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public refreshing = true;
  public id: any;
  public department: Department = new Department;
  public subscriptions: Subscription[] = [];
  public departmentList: Department[] = [];
  public employees: Employee[] = [];
  public employeeDs: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  public employeeDisplayedColumns = ['number', 'personnelNumber', 'firstName', 'lastName'];
  public isEmployeeDsChecked: boolean = true;
  private messageTitle: string = '';
  private message: string = '';
  constructor(private activatedRouter: ActivatedRoute,
              private departmentService: DepartmentService,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService,
              private translate: TranslateService,
              private employeeService: EmployeeService,
              private dialog: MatDialog,
              private router: Router) {
    this.refreshing = this.applicationService.getRefreshing();
    this.id = activatedRouter.snapshot.paramMap.get('id');
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => this.translate.use(us.locale)));
    this.subscriptions.push(this.applicationService.refreshing.subscribe(ref => this.refreshing = ref));
  }

  ngOnInit(): void {
    this.loadDepartment();
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
      this.departmentService.updateDepartment(this.department).subscribe(
        (response: Department) => {
          this.department = response;
            this.employeeDs.data.forEach(employee => employee.department = this.department);
            this.updateEmployees();
        }, (errorResponse: HttpErrorResponse) => {
          this.applicationService.changeRefreshing(false);
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private updateEmployees(): void {
    let employeesToSave: Employee[] = this.getEmployeesToSave();
    this.subscriptions.push(
      this.employeeService.updateAllEmployees(employeesToSave).subscribe(
        () => this.afterCommit(),
        (errorResponse: HttpErrorResponse) => {
          this.applicationService.changeRefreshing(false);
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private getEmployeesToSave(): Employee[] {
    let employeeToSave: Employee[] = [];
    if (this.employeeDs.data.length > 0) {
      employeeToSave = employeeToSave.concat(this.employeeDs.data);
      this.employees.forEach(employee => {
        const e = this.employeeDs.data.find(emp => emp.id === employee.id);
        if (!e) {
          employee.department = null;
        }
        if (!employeeToSave.find(emp => emp.id === employee.id)) {
          employeeToSave.push(employee);
        }
      });
    } else {
      this.employees.forEach(employee => {
        employee.department = null;
        employeeToSave.push(employee);
      });
    }
    return employeeToSave;
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

  private loadDepartment(): void {
    this.subscriptions.push(
      this.departmentService.getDepartmentById(this.id).subscribe(
        (response: Department) => {
          this.department= response;
          this.updateDepartmentsList();
          this.updateEmployeesDs();
        },
        (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        })
    );
  }

  private updateDepartmentsList(): void {
    this.subscriptions.push(
      this.departmentService.getPossibleParentDepartments(this.department.id).subscribe(
        (response: Department[]) => {
          this.departmentList = response;
          this.department.parentDepartment = this.departmentList.find(dept => dept.id === this.department.parentDepartment?.id);
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message)
        }
      )
    )
  }

  private updateEmployeesDs(): void {
    this.subscriptions.push(
      this.employeeService.getEmployeesByDepartments(this.id).subscribe(
        (response: Employee[]) => {
          this.initDataSource(response);
          response.forEach(emp => this.employees.push(emp));
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message)
        }
      )
    )
  }

  private initDataSource(employees: Employee[]): void {
    this.employeeDs = new MatTableDataSource<Employee>(employees);
    this.employeeDs.paginator = this.paginator;
    this.employeeDs.sort = this.sort;
  }

}
