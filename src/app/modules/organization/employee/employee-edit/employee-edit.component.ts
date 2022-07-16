import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Employee} from '../../../../model/employee';
import {User} from '../../../../model/user';
import {Department} from '../../../../model/department';
import {Position} from '../../../../model/position';
import {ApplicationService} from '../../../../service/application.service';
import {EmployeeService} from '../../../../service/employee.service';
import {UserService} from '../../../../service/user.service';
import {DepartmentService} from '../../../../service/department.service';
import {PositionService} from '../../../../service/position.service';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {EventNotificationService} from '../../../../service/event-notification.service';
import {EmployeePrefillDialogComponent} from '../employee-prefill-dialog/employee-prefill-dialog.component';
import {ApplicationConstants} from '../../../shared/application-constants';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {EmployeeSaveDialogComponent} from '../employee-save-dialog/employee-save-dialog.component';
import {AbstractEditor} from '../../../shared/editor/abstract-editor';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  public phone = '+79639137660';
  public hireDate: Date | null = null;
  public dismissalDate: Date | null = null;
  public employeeToUpdate: Employee = new Employee();
  public users: User[] = [];
  public departments: Department[] = [];
  public positions: Position[] = [];
  private id: any;

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private activatedRouter: ActivatedRoute,
              private employeeService: EmployeeService,
              private userService: UserService,
              private departmentService: DepartmentService,
              private positionService: PositionService,
              ) {
    super(injector, router, translate, eventNotificationService, applicationService, dialog);

      this.id = this.activatedRouter.snapshot.paramMap.get('id');
      this.refreshing = applicationService.getRefreshing();
      this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.employeeService.getById(this.id).subscribe(
        (response: Employee) => {
          this.employeeToUpdate = response;
          this.loadUsers();
          this.loadDepartments();
          this.loadPositions();
          if (this.employeeToUpdate.hireDate) {
            // this.hireDate = new Date(Date.parse(this.employeeToUpdate.hireDate!.toString()));
            this.hireDate = new Date(this.employeeToUpdate.hireDate);
          }

          if (this.employeeToUpdate.dismissalDate) {
            // this.dismissalDate = new Date(Date.parse(this.employeeToUpdate.dismissalDate.toString()));
            this.dismissalDate = new Date(this.employeeToUpdate.dismissalDate);
          }
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public openSaveDialog() {
    this.dialog.open(EmployeeSaveDialogComponent, {
      data: this.employeeToUpdate,
      panelClass: this.isDarkMode ? 'dark' : ''
    }).afterClosed().subscribe(response => {
      if (response.event.action === ApplicationConstants.DIALOG_ACTION_SAVE) {
        this.onUpdateEmployee();
      }
    });

  }

  public openPrefillDialog($event: any): void {
    if ($event.value) {
      this.dialog.open(EmployeePrefillDialogComponent, {
        data: $event.value,
        panelClass: this.isDarkMode ? 'dark' : ''
      }).afterClosed().subscribe(response => {
        if (response.event.action === ApplicationConstants.DIALOG_ACTION_APPLY) {
          this.preFillData($event.value);
        }
      });
    }

  }

  public updateHireDate(event: any): void {
    this.hireDate = new Date(Date.parse(event.target.value))
    this.employeeToUpdate.hireDate = this.hireDate;
  }

  public updateDismissalDate(event: any): void {
    this.dismissalDate = new Date(Date.parse(event.target.value))
    this.employeeToUpdate.dismissalDate = this.dismissalDate;
  }

  private loadUsers(): void {
    this.subscriptions.push(
      this.userService.getUsersWithoutEmployee().subscribe(
        (response: User[]) => {
          if (this.employeeToUpdate.user) {
            this.users.push(this.employeeToUpdate.user)
          }
          this.users = this.users.concat(response);

        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getAll().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.employeeToUpdate.department = this.departments.find(d => d.id === this.employeeToUpdate.department?.id)
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private loadPositions(): void {
    this.subscriptions.push(
      this.positionService.getAll().subscribe(
        (response: Position[]) => {
          this.positions = response;
          this.employeeToUpdate.position = this.positions.find(p => p.id === this.employeeToUpdate.position?.id)
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private onUpdateEmployee(): void {
    this.subscriptions.push(
      this.employeeService.update(this.employeeToUpdate).subscribe(
        () => {
          this.afterCommit('EmployeeSavedMsg', '/organization/employees');
        },
        (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      )
    );
  }

  private preFillData(user: User): void {
    this.employeeToUpdate.firstName = user.firstName;
    this.employeeToUpdate.lastName = user.lastName;
    this.employeeToUpdate.email = user.email;
  }

}
