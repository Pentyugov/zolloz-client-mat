import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {Role} from "../../model/role";
import {RoleService} from "../../service/role.service";
import {EventNotificationService} from "../../service/event-notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EventNotificationCaptionEnum} from "../../enum/event-notification-caption.enum";
import {MatSort} from "@angular/material/sort";
import {TranslateService} from "@ngx-translate/core";
import {ApplicationService} from "../../service/application.service";
import {UserSettings} from "../../model/user-settings";
import {ApplicationConstants} from "../../shared/application-constants";
import {AbstractBrowser} from "../../shared/screens/browser/AbstractBrowser";
import {Router} from "@angular/router";

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
export class RoleComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);
  public roles: Role [] = [];
  public dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>([]);
  public columnsToDisplay = ApplicationConstants.ROLE_TABLE_COLUMNS;
  public expandedElement: Role | null = null;

  private userSettings: UserSettings;

  constructor(router: Router,
              applicationService: ApplicationService,
              eventNotificationService: EventNotificationService,
              translate: TranslateService,
              private roleService: RoleService,
              public dialog: MatDialog) {
    super(router, translate, eventNotificationService, applicationService);

    this.userSettings = this.applicationService.getUserSettings();
    this.translate.use(this.userSettings.locale);

    this.subscriptions.push(
      this.applicationService.userSettings.subscribe(us => {
        this.userSettings = us;
        this.translate.use(this.userSettings.locale);
      }));

  }

  ngOnInit(): void {
    this.getRoles();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private getRoles(showNotification: boolean = false): void {
    this.refreshing = true;
    this.roleService.getRoles().subscribe(
      (response: Role[]) => {
        this.roles = response;
        this.initDataSource(response);
        this.refreshing = false;
        if (showNotification) {
          this.eventNotificationService.showSuccessNotification(EventNotificationCaptionEnum.SUCCESS,`${this.roles.length} role(s) was successfully loaded`);
        }
      },(errorResponse: HttpErrorResponse) => {
        this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,errorResponse.error.message);
      });
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  public openDialog(action: string, role: any): void {
    role.action = action;
    const dialogRef = this.dialog.open(RoleContentComponent, {
      data: role,
      width: ApplicationConstants.DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === ApplicationConstants.DIALOG_ACTION_ADD) {
        this.onCreateRole(result.data);
      } else if (result.event === ApplicationConstants.DIALOG_ACTION_UPDATE) {
        this.onUpdateRole(result.data);
      } else if (result.event === ApplicationConstants.DIALOG_ACTION_DELETE) {
        this.onDeleteRole(result.data);
      }
    });
  }

  private onCreateRole(role: Role): void {
    if (role) {
      this.roleService.addRole(role).subscribe(
        (response: Role) => {
          this.getRoles();
          this.eventNotificationService
            .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Role: ${response.name} was updated successfully`);
        }, (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService
            .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        });
    }
  }

  private onUpdateRole(role: Role): void {
      if (role) {
        this.roleService.updateRole(role).subscribe((response) => {
          this.getRoles();
          this.eventNotificationService
            .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Role: ${response.name} was updated successfully`);
        }, (errorResponse: HttpErrorResponse) => {
            this.eventNotificationService
              .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message)
        });
      }
  }

  private onDeleteRole(role: Role): void {
    if (role) {
      this.roleService.deleteRole(role.id).subscribe(() => {
        this.getRoles();
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Role: ${role.name} was updated successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message)
      });
    }
  }

  public getPermissions(role: Role): string {
    let result = '';
    if (role && role.permissions) {
      result = role.permissions.map(a => a.name).join('; ')
    }
    return result;
  }

  private initDataSource(roles: Role[]): void {
    this.dataSource = new MatTableDataSource<Role>(roles);
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

}

@Component({
  selector: 'app-role-content',
  templateUrl: 'role-content.html',
  styleUrls: ['role-content.scss']
})
export class RoleContentComponent {
  action: string;
  local_data: any;
  inputWidth = 'width: ' + ApplicationConstants.DIALOG_WIDTH;
  constructor(private translate: TranslateService,
              public dialogRef: MatDialogRef<RoleContentComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: Role) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({
      event: this.action, data: this.local_data
    });
  }

  closeDialog(): void {
    this.dialogRef.close({
      event: 'Cancel'
    });
  }

}
