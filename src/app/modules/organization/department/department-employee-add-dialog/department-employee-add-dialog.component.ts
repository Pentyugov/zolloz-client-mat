import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Employee} from "../../../../model/employee";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EmployeeService} from "../../../../service/employee.service";
import {ApplicationConstants} from "../../../shared/application-constants";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-department-employee-add-dialog',
  templateUrl: 'department-employee-add-dialog.component.html',
  styleUrls: []
})
export class DepartmentEmployeeAddDialogComponent implements OnInit, OnDestroy {
  public action: string;
  public local_data: any;
  public employeeDs: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  public selection = new SelectionModel<Employee>(true, []);
  public employeeDisplayedColumns = ['select', 'personnelNumber', 'firstName', 'lastName', 'department'];
  public selectedEmployees: Employee[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  private subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<DepartmentEmployeeAddDialogComponent>,
              private employeeService: EmployeeService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.selectedEmployees = this.local_data.employees;
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public test($event: any, employee: Employee) {
    if ($event) {
      this.selection.toggle(employee);
    }

  }

  public isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.employeeDs.data.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.employeeDs.data.forEach((employee) => {
        this.selection.select(employee);
      });
  }

  public doAction(): void {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_SAVE,
        data: this.selection.selected
      }
    });
  }

  public closeDialog(): void {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_CANCEL,
        data: null
      }
    });
  }

  private loadEmployees(): void {
    this.subscriptions.push(
      this.employeeService.getAll().subscribe(
        (response: Employee[]) => {
          this.initDataSource(response);
        }
      )
    );
  }

  private initDataSource(employees: Employee[]): void {
    this.employeeDs = new MatTableDataSource<Employee>(employees);
    this.employeeDs.paginator = this.paginator;
    this.employeeDs.sort = this.sort;
    this.selectedEmployees.forEach(employee => {
      this.employeeDs.data.filter(e => {
        if (employee.id === e.id) {
          this.selection.select(e);
        }
      })
    });
  }
}
