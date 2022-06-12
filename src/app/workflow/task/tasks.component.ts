import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractBrowser} from "../../shared/screens/browser/AbstractBrowser";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../service/event-notification.service";
import {ApplicationService} from "../../service/application.service";
import {ScreenService} from "../../service/screen.service";
import {MatDialog} from "@angular/material/dialog";
import {TaskService} from "../../service/task.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {Task} from "../../model/task";
import {Project} from "../../model/project";
import {TaskEditComponent} from "./tast-edit/task-edit/task-edit.component";

@Component({
  selector: 'app-task',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent extends AbstractBrowser implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) sort: MatSort = Object.create(null);
  public columnsToDisplay = ApplicationConstants.TASK_TABLE_COLUMNS;
  public tasks: Task[] = [];
  public dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);
  private readonly defaultFilterPredicate?: (data: Task, filter: string) => boolean;
  private readonly statusFilterPredicate?: (data: Task, filter: string) => boolean;
  private isDefaultPredicate: boolean = true;
  public totalCount = 0;
  public lowPriority = 0;
  public mediumPriority = 0;
  public highPriority = 0;
  public readonly LOW = Task.PRIORITY_LOW;
  public readonly MEDIUM = Task.PRIORITY_MEDIUM;
  public readonly HIGH = Task.PRIORITY_HIGH;
  public readonly TOTAL = 'total';

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              screenService: ScreenService,
              protected dialog: MatDialog,
              protected editor: MatDialog,
              protected taskService: TaskService) {
    super(router, translate, eventNotificationService, applicationService, screenService);

    this.defaultFilterPredicate = this.dataSource.filterPredicate;
    this.statusFilterPredicate = (task: Task, filter: string) => {
      if (task.priority)
        return task.priority.toString().trim().toLowerCase() == filter;
      return false;
    };

  }

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.subscriptions.push(
      this.taskService.getAll().subscribe(
        (response: Task[]) => {
          this.tasks = response;
          this.initDataSource(this.tasks);
          this.initFilters();
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      ));
  }


  private initDataSource(tasks: Task[]): void {
    this.dataSource.data = tasks;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initFilters(): void {
    this.totalCount = this.dataSource.data.length;
    this.lowPriority = this.btnCategoryClick(this.LOW);
    this.mediumPriority = this.btnCategoryClick(this.MEDIUM);
    this.highPriority = this.btnCategoryClick(this.HIGH);
    this.btnCategoryClick('');
  }

  public btnCategoryClick(val: string): number {
    if (this.isDefaultPredicate) {
      this.changePredicate(this.statusFilterPredicate);
    }
    this.clickedRow = null;
    if (val !== '') {
      this.dataSource.filter = val.toString().trim().toLowerCase();
      return this.dataSource.filteredData.length;
    } else {
      this.clearFilters();
      return this.totalCount;
    }
  }

  private changePredicate(filterPredicate: any): void {
    this.clearFilters();
    this.dataSource.filterPredicate = filterPredicate;
    this.isDefaultPredicate = !this.isDefaultPredicate;
  }

  public clearFilters(){
    this.dataSource.filter = '';
  }

  public applyFilter(filterValue: string): void {
    if (!this.isDefaultPredicate) {
      this.changePredicate(this.defaultFilterPredicate);
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getPriority(priority: string): string {
    return priority === this.LOW ? 'Priority.Low' : priority === this.MEDIUM ? 'Priority.Medium' : 'Priority.High';
  }

  public openAddDialog(editedItem: Project | null): void {
    this.openDialog(ApplicationConstants.DIALOG_ACTION_ADD, editedItem);
  }

  public openEditDialog(editedItem: Project | null): void {
    if (this.isActionPermit(this.EDIT_ACTION)) {
      this.openDialog(ApplicationConstants.DIALOG_ACTION_UPDATE, editedItem);
    }
  }

  public openDialog(action: string, editedItem: Project | null): void {
    let isNewItem = false;
    if (action === ApplicationConstants.DIALOG_ACTION_ADD) {
      isNewItem = true;
    }
    const editor = this.editor.open(TaskEditComponent, {
      width: "100%",
      height: "75%",
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        editedItem: editedItem,
        isNewItem: isNewItem
      }
    });

    editor.afterClosed().subscribe(() => {
      this.loadTasks();
    });
  }
}
