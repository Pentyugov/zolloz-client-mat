import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../service/user.service";
import {Subscription} from "rxjs";
import {User} from "../../model/user";
import {MatTableDataSource} from "@angular/material/table";
import {UserConstants} from "./user-constants";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Role} from "../../model/role";
import {TranslateService} from "@ngx-translate/core";
import {ApplicationService} from "../../service/application.service";
import {UserSettings} from "../../model/user-settings";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  public editorOpened: boolean = false;
  public editedUser: User = new User();
  public users: User[] = [];
  public columnsToDisplay = UserConstants.TABLE_COLUMNS;
  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  private subscriptions: Subscription[] = [];
  private userSettings: UserSettings;
  public refreshing = false;
  constructor(private userService: UserService,
              private translate: TranslateService,
              private applicationService: ApplicationService) {
    this.userSettings = this.applicationService.getUserSettings();
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.userSettings = us;
      this.translate.use(this.userSettings.locale);
    }));

    this.subscriptions.push(this.applicationService.refreshing.subscribe(refreshing => {
      this.refreshing = refreshing;
    }));
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public loadUsers(): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
          this.initDataSource(response);
        })
    );
  }

  private initDataSource(users: User[]): void {
    this.dataSource = new MatTableDataSource<User>(users);
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public applyFilter(value: any) {
    if (this.dataSource) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  openDialog(add: string, param2: {}) {

  }

  openEditor(user: User): void {
    this.editedUser = user;
    this.editorOpened = true;
  }

  onEditorClose(test: boolean) {
    this.ngOnInit();
    this.editorOpened = !test;
  }
}
