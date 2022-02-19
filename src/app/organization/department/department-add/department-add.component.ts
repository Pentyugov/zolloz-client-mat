import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {DepartmentService} from "../../../service/department.service";
import {ApplicationService} from "../../../service/application.service";
import {EventNotificationService} from "../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Department} from "../../../model/department";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Employee} from "../../../model/employee";
import {MatTableDataSource} from "@angular/material/table";
import {ApplicationConstants} from "../../../shared/application-constants";

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
  private messageTitle: string = '';
  private message: string = '';
  constructor(private departmentService: DepartmentService,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService,
              private translate: TranslateService,
              private dialog: MatDialog,
              private router: Router) {
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => this.translate.use(us.locale)));
    this.subscriptions.push(this.applicationService.refreshing.subscribe(ref => this.refreshing = ref));
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public openDialog(action: string, data: any) {
    data.action = action;
    const dialogRef = this.dialog.open(DepartmentAddDialogComponent, {
      data: data,
      width: ApplicationConstants.DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
        this.onSaveDepartment();
      }
    });
  }

  public changeHeadValue($event: any): void {
    if ($event.checked) {
      this.department.parentDepartment = null;
    }
  }

  private onSaveDepartment(): void {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(
      this.departmentService.addDepartment(this.department).subscribe(
        (response: Department) => {
          this.department = response;

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

        }, (errorResponse: HttpErrorResponse) => {
          this.subscriptions.push(
            this.translate.get('Error').subscribe(m => this.messageTitle = m)
          );
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showErrorNotification(this.messageTitle, errorResponse.error.message);
        }
      )
    );
  }

  private loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe(
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

}

@Component({
  selector: 'app-department-add-dialog',
  templateUrl: 'department-add-dialog.component.html',
  styleUrls: []
})
export class DepartmentAddDialogComponent {
  action: string;
  local_data: any;
  constructor(public dialogRef: MatDialogRef<DepartmentAddDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Department) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_SAVE
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }
}
