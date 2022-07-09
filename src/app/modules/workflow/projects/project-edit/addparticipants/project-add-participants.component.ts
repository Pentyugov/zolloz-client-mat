import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../../../model/user";
import {UserService} from "../../../../../service/user.service";
import {ApplicationConstants} from "../../../../shared/application-constants";

@Component({
  selector: 'app-add-participants',
  templateUrl: './project-add-participants.component.html',
  styleUrls: ['./project-add-participants.component.scss']
})
export class ProjectAddParticipantsComponent implements OnInit, OnDestroy {
  public action: string;
  public local_data: any;
  public usersDs: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  public selection = new SelectionModel<User>(true, []);
  public userDisplayedColumns = ['select', 'firstName', 'lastName', 'username', 'email'];
  public selectedUsers: User[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) sort: MatSort = Object.create(null);
  private subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<ProjectAddParticipantsComponent>,
              private userService: UserService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.local_data = {...data};
    this.action = this.local_data.action;
    this.selectedUsers = this.local_data.participants;
  }

  ngOnInit(): void {
    this.loadProjectParticipants();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public test($event: any, user: User) {
    if ($event) {
      this.selection.toggle(user);
    }

  }

  public isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.usersDs.data.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.usersDs.data.forEach((user) => {
        this.selection.select(user);
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

  private loadProjectParticipants(): void {
    let roleNames = [ApplicationConstants.ROLE_PROJECT_MANAGER, ApplicationConstants.ROLE_PROJECT_PARTICIPANT];
    // let roleNames = ['admin', 'apentyugov']
    this.subscriptions.push(
      this.userService.getAllWithAnyRole(roleNames).subscribe(
        (response: User[]) => {
          this.initDataSource(response);
        }
      )
    );
  }

  private initDataSource(users: User[]): void {
    this.usersDs = new MatTableDataSource<User>(users);
    this.usersDs.paginator = this.paginator;
    this.usersDs.sort = this.sort;
    this.selectedUsers?.forEach(user => {
      this.usersDs.data.filter(u => {
        if (user.id === u.id) {
          this.selection.select(u);
        }
      })
    });
  }
}
