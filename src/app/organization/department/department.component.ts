import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Department} from "../../model/department";
import {DepartmentService} from "../../service/department.service";
import {ApplicationService} from "../../service/application.service";
import {EventNotificationService} from "../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../model/user";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public departments: Department[] = [];
  public editorOpened: boolean = false;
  public editedDepartment: Department = new Department();
  public columnsToDisplay = ApplicationConstants.DEPARTMENT_TABLE_COLUMNS;
  public dataSource: MatTableDataSource<Department> = new MatTableDataSource<Department>([]);
  public departmentToDelete: Department = new Department();
  private title: string = '';
  private message: string = '';
  public refreshing = false;

  private subscriptions: Subscription[] = [];
  constructor(private departmentService: DepartmentService,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService,
              private translate: TranslateService) {
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.translate.use(us.locale);
    }));

    this.subscriptions.push(this.applicationService.refreshing.subscribe(refreshing => {
      this.refreshing = refreshing;
    }));
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

  openEditor(department: Department): void {
    this.editedDepartment = department;
    this.editorOpened = true;
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

}
