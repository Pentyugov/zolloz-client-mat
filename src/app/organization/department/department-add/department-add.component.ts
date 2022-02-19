import {Component, OnDestroy, OnInit} from '@angular/core';
import {DepartmentService} from "../../../service/department.service";
import {ApplicationService} from "../../../service/application.service";
import {EventNotificationService} from "../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Department} from "../../../model/department";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Employee} from "../../../model/employee";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.scss']
})
export class DepartmentAddComponent implements OnInit, OnDestroy {

  public refreshing = true;
  public department: Department = new Department;
  public subscriptions: Subscription[] = [];
  public departmentList: Department[] = [];
  public employees: Employee[] = [];
  public employeeDs: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  public employeeDisplayedColumns = ['number', 'firstName', 'lastName'];
  constructor(private departmentService: DepartmentService,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private router: Router,) {
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => this.translate.use(us.locale)));
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public openDialog(action: string, data: any) {

  }

  private loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe(
        (response: Department[]) => {
          this.departmentList = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message);
        })
    );
  }

  public changeHeadValue($event: any): void {
    if ($event.checked) {
      this.department.parentDepartment = null;
    }
  }
}
