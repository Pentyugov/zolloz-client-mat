import {Component, OnInit, ViewChild} from '@angular/core';
import {Role} from "../../model/role";
import {RoleService} from "../../service/role.service";
import {EventNotificationService} from "../../service/event-notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RoleComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  public roles: Role [] = [];
  public refreshing: boolean = false;
  public dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>([]);
  columnsToDisplay = ['number', 'name', 'description', 'permissions', 'action', ];
  expandedElement: Role | null = null;

  constructor(private roleService: RoleService,
              private eventNotificationService: EventNotificationService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getRoles(true);
  }

  private getRoles(showNotification: boolean = false): void {
    this.refreshing = true;
    this.roleService.getRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
        this.initDataSource(response);
        this.refreshing = false;
        if (showNotification) {
          this.eventNotificationService.showSuccessNotification('Success',`${this.roles.length} role(s) was successfully loaded`);
        }
      },(errorResponse: HttpErrorResponse) => {
        this.eventNotificationService.showErrorNotification('Error',errorResponse.error.message);
      });
  }

  private initDataSource(roles: Role[]): void {
    this.dataSource = new MatTableDataSource<Role>(roles);
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  public openDialog(action: string, role: any): void {

  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }


  public openAddRoleDialog(add: string, param2: {}) {

  }
}
