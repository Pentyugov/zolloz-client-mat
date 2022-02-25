import {Component, OnDestroy, OnInit} from '@angular/core';
import {Employee} from "../../../model/employee";
import {User} from "../../../model/user";
import {Department} from "../../../model/department";
import {Position} from "../../../model/position";
import {ApplicationService} from "../../../service/application.service";
import {DatePipe} from "@angular/common";
import {EmployeeService} from "../../../service/employee.service";
import {UserService} from "../../../service/user.service";
import {DepartmentService} from "../../../service/department.service";
import {PositionService} from "../../../service/position.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {EventNotificationService} from "../../../service/event-notification.service";
import {EmployeePrefillDialogComponent} from "../employee-prefill-dialog/employee-prefill-dialog.component";
import {ApplicationConstants} from "../../../shared/application-constants";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit, OnDestroy {
  public refreshing: boolean = false;
  public hireDate: Date | null = null;
  public dismissalDate: Date | null = null;
  public employeeToCreate: Employee = new Employee();
  public users: User[] = [];
  public departments: Department[] = [];
  public positions: Position[] = [];
  private subscriptions: Subscription[] = [];
  private id: any;


  constructor(private applicationService: ApplicationService,
              private activatedRouter: ActivatedRoute,
              private employeeService: EmployeeService,
              private userService: UserService,
              private departmentService: DepartmentService,
              private positionService: PositionService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private eventNotificationService: EventNotificationService) {

    this.id = this.activatedRouter.snapshot.paramMap.get('id');
    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));

  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.employeeService.getEmployeeById(this.id).subscribe(
        (response: Employee) => {
          this.employeeToCreate = response;
          this.loadUsers();
          this.loadDepartments();
          this.loadPositions();
          if (this.employeeToCreate.hireDate) {
            this.hireDate = new Date(Date.parse(this.employeeToCreate.hireDate!.toString()));
          }

          if (this.employeeToCreate.dismissalDate) {
            this.dismissalDate = new Date(Date.parse(this.employeeToCreate.dismissalDate.toString()));
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  openDialog(save: string, employeeToCreate: Employee) {
    console.log('saving employee')
    console.log(this.employeeToCreate)
  }

  public openPrefillDialog($event: any): void {
    if ($event.value) {
      this.dialog.open(EmployeePrefillDialogComponent, {
        data: $event.value,
        width: ApplicationConstants.DIALOG_WIDTH
      }).afterClosed().subscribe(response => {
        if (response.event.action === ApplicationConstants.DIALOG_ACTION_APPLY) {
          this.preFillData($event.value);
        }
      });
    }

  }

  public updateHireDate(event: any): void {
    this.hireDate = new Date(Date.parse(event.target.value))
    this.employeeToCreate.hireDate = this.hireDate;
  }

  public updateDismissalDate(event: any): void {
    this.dismissalDate = new Date(Date.parse(event.target.value))
    this.employeeToCreate.dismissalDate = this.dismissalDate;
  }

  private loadUsers(): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
          this.employeeToCreate.user = this.users.find(u => u.id === this.employeeToCreate.user?.id)
        }
      )
    );
  }

  private loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.employeeToCreate.department = this.departments.find(d => d.id === this.employeeToCreate.department?.id)
        }
      )
    );
  }

  private loadPositions(): void {
    this.subscriptions.push(
      this.positionService.getPositions().subscribe(
        (response: Position[]) => {
          this.positions = response;
          this.employeeToCreate.position = this.positions.find(p => p.id === this.employeeToCreate.position?.id)
        }
      )
    );
  }

  private preFillData(user: User): void {
    this.employeeToCreate.firstName = user.firstName;
    this.employeeToCreate.lastName = user.lastName;
    this.employeeToCreate.email = user.email;
  }
}
