import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {Department} from "../../../model/department";
import {DepartmentService} from "../../../service/department.service";
import {ApplicationService} from "../../../service/application.service";
import {EventNotificationService} from "../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AbstractBrowser} from "../../../shared/screens/browser/AbstractBrowser";
import {Router} from "@angular/router";
import {ScreenService} from "../../../service/screen.service";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public departments: Department[] = [];
  public columnsToDisplay = ApplicationConstants.DEPARTMENT_TABLE_COLUMNS;
  public dataSource: MatTableDataSource<Department> = new MatTableDataSource<Department>([]);
  public departmentToDelete: Department = new Department();

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              screenService: ScreenService,
              dialog: MatDialog,
              private departmentService: DepartmentService) {
    super(router, translate, eventNotificationService, applicationService, dialog, screenService);
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  public openDeleteDialog(department: Department) {
    this.departmentToDelete = department;
    const dialogRef = this.dialog.open(DepartmentDeleteDialogComponent, {
      data: this.departmentToDelete,
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? ApplicationConstants.THEME_DARK_MODE_CLASS : ''
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_DELETE) {
        this.onDeleteDepartment();
      }
    });
  }

  private loadDepartments(): void {
    this.subscriptions.push(
      this.departmentService.getDepartments().subscribe(
        (response: Department[]) => {
          this.departments = response;
          this.initDataSource(response);
        }, (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
        }
      )
    );
  }

  private initDataSource(departments: Department[]): void {
    this.dataSource = new MatTableDataSource<Department>(departments);
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }



  private onDeleteDepartment(): void {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(
      this.departmentService.deleteDepartment(this.departmentToDelete.id).subscribe(
        () => {
          this.subscriptions.push(this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_SUCCESS).subscribe(m => {
            this.messageTitle = m;
          }));

          this.subscriptions.push(this.translate.get('DepartmentDeletedMsg').subscribe(m => {
            this.message = m;
          }));
          this.loadDepartments();
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showSuccessNotification(this.messageTitle, this.message);
        }, (errorResponse: HttpErrorResponse) => {
          this.subscriptions.push(this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => {
            this.messageTitle = m;
          }));

          this.loadDepartments();
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showErrorNotification(this.messageTitle, errorResponse.error.message);
        }
      )
    )
  }
}

@Component({
  selector: 'app-department-delete-dialog',
  templateUrl: 'department-delete-dialog.component.html',
  styleUrls: []
})
export class DepartmentDeleteDialogComponent {
  action: string;
  local_data: any;
  constructor(public dialogRef: MatDialogRef<DepartmentDeleteDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Department) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_DELETE
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: ApplicationConstants.DIALOG_ACTION_CANCEL
    });
  }
}
