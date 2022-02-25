import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ApplicationService} from "../../../service/application.service";
import {EmployeeService} from "../../../service/employee.service";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {Employee} from "../../../model/employee";
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {DepartmentService} from "../../../service/department.service";
import {PositionService} from "../../../service/position.service";
import {Department} from "../../../model/department";
import {Position} from "../../../model/position";
import {MatDialog} from "@angular/material/dialog";
import {ApplicationConstants} from "../../../shared/application-constants";
import {EmployeePrefillDialogComponent} from "../employee-prefill-dialog/employee-prefill-dialog.component";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {EmployeeSaveDialogComponent} from "../employee-save-dialog/employee-save-dialog.component";

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit, OnDestroy {
  public refreshing: boolean = false;
  public hireDate: Date | null = null;
  public dismissalDate: Date | null = null;
  public employeeToCreate: Employee = new Employee();
  public users: User[] = [];
  public departments: Department[] = [];
  public positions: Position[] = [];
  private subscriptions: Subscription[] = [];
  private messageTitle: string = '';
  private message: string = '';


  constructor(private applicationService: ApplicationService,
              private employeeService: EmployeeService,
              private userService: UserService,
              private departmentService: DepartmentService,
              private positionService: PositionService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private router: Router,
              private eventNotificationService: EventNotificationService) {

    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));

  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();
    this.loadPositions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  openSaveDialog() {
    this.dialog.open(EmployeeSaveDialogComponent, {
      data: this.employeeToCreate,
      width: ApplicationConstants.DIALOG_WIDTH
    }).afterClosed().subscribe(response => {
      if (response.event.action === ApplicationConstants.DIALOG_ACTION_SAVE) {
        this.onSaveEmployee();
      }
    });
  }

  public openPrefillDialog($event: any): void {
    if ($event.value) {
      this.dialog.open(EmployeeSaveDialogComponent, {
        data: $event.value,
        width: ApplicationConstants.DIALOG_WIDTH
      }).afterClosed().subscribe(response => {
        if (response.event.action === ApplicationConstants.DIALOG_ACTION_SAVE) {
          this.preFillData($event.value);
        }
      });
    }

  }

  private onSaveEmployee(): void {
    this.subscriptions.push(
      this.employeeService.addEmployee(this.employeeToCreate).subscribe(
        () => {
          this.afterCommit();
        },
        (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  public updateHireDate(event: any): void {
    this.hireDate = new Date(Date.parse(event.target.value))
    this.employeeToCreate.hireDate = this.hireDate;
  }

  public updateDismissalDate(event: any): void {
    this.dismissalDate = new Date(Date.parse(event.target.value))
    this.employeeToCreate.dismissalDate = this.dismissalDate;
  }

  private afterCommit(): void {
    this.subscriptions.push(
      this.translate.get('Success').subscribe(m => this.messageTitle = m)
    );

    this.subscriptions.push(
      this.translate.get('EmployeeSavedMsg').subscribe(m => this.message = m)
    );

    this.applicationService.changeRefreshing(false);
    this.router.navigateByUrl('/organization/employees').then(() => {
      this.eventNotificationService.showSuccessNotification(this.messageTitle, this.message);
    });
  }

  private loadUsers(): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
          this.employeeToCreate.user = this.users.find(u => u.id === this.employeeToCreate.user?.id)
        },
        (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
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
        },
        (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
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
        },
        (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private preFillData(user: User): void {
    this.employeeToCreate.firstName = user.firstName;
    this.employeeToCreate.lastName = user.lastName;
    this.employeeToCreate.email = user.email;
  }

  private showErrorNotification(errorMessage: string): void {
    this.subscriptions.push(
      this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => this.messageTitle = m)
    );
    this.eventNotificationService.showErrorNotification(this.messageTitle, errorMessage);
  }
}
