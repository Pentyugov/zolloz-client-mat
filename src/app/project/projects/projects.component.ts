import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractBrowser} from "../../shared/screens/browser/AbstractBrowser";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../service/event-notification.service";
import {ApplicationService} from "../../service/application.service";
import {ProjectService} from "../../service/project.service";
import {Project} from "../../model/project";
import {HttpErrorResponse} from "@angular/common/http";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatDialog} from "@angular/material/dialog";
import {ProjectEditComponent} from "./project-edit/project-edit.component";
import {ProjectDeleteDialogComponent} from "./project-delete-dialog/project-delete-dialog.component";
import {NgxPermissionsService} from "ngx-permissions";
import {AuthenticationService} from "../../service/authentication.service";
import {ScreenService} from "../../service/screen.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends AbstractBrowser implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, {static: true}) sort: MatSort = Object.create(null);
  public columnsToDisplay = ApplicationConstants.PROJECT_TABLE_COLUMNS;
  public projects: Project[] = [];
  public dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>([]);
  private readonly defaultFilterPredicate?: (data: any, filter: string) => boolean;
  private readonly statusFilterPredicate?: (data: Project, filter: string) => boolean;
  private isDefaultPredicate: boolean = true;
  totalCount = 0;
  Closed = 0;
  InProgress = 0;
  Open = 0;

  public constructor(router: Router,
                     translate: TranslateService,
                     eventNotificationService: EventNotificationService,
                     applicationService: ApplicationService,
                     screenService: ScreenService,
                     protected dialog: MatDialog,
                     protected projectService: ProjectService,
                     protected projectEditor: MatDialog
  ) {
    super(router, translate, eventNotificationService, applicationService, screenService);
    this.defaultFilterPredicate = this.dataSource.filterPredicate;
    this.statusFilterPredicate = (project: Project, filter: string) => {
      return project.status.toString().trim().toLowerCase() == filter;
    };
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadProjects(): void {
    this.subscriptions.push(
      this.projectService.getProjects().subscribe(
        (response: Project[]) => {
          this.projects = response;
          this.initDataSource(this.projects);
          this.initFilters();
        }, (errorResponse: HttpErrorResponse) => {
          this.showErrorNotification(errorResponse.error.message);
        }
      ));
  }

  private initDataSource(projects: Project[]): void {
    this.dataSource.data = projects;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private initFilters(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.btnCategoryClick(Number(10));
    this.InProgress = this.btnCategoryClick(20);
    this.Closed = this.btnCategoryClick(30);
    this.btnCategoryClick(-1);
  }

  public btnCategoryClick(val: Number): number {
    if (this.isDefaultPredicate) {
      this.changePredicate(this.statusFilterPredicate);
    }
    this.clickedRow = null;
    if (val > 0) {
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

  public getStatus(status: number): string {
    return status === 10 ? 'Status.Open' : status === 20 ? 'Status.InProgress' : 'Status.Closed';
  }

  public openDialog(action: string, editedItem: Project | null): void {
    let isNewItem = false;
    if (action === ApplicationConstants.DIALOG_ACTION_ADD) {
      isNewItem = true;
    }
    const editor = this.projectEditor.open(ProjectEditComponent, {
      width: "100%",
      height: "75%",
      panelClass: this.isDarkMode ? 'dark' : '',
      data: {
        editedItem: editedItem,
        isNewItem: isNewItem
      }
    });

    editor.afterClosed().subscribe(() => {
      this.loadProjects();
    });
  }

  public openDeleteDialog(project: Project) {
    this.dialog.open(ProjectDeleteDialogComponent, {
      data: project,
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : ''
    }).afterClosed().subscribe(response => {
      if (response.event.action === ApplicationConstants.DIALOG_ACTION_DELETE) {
        this.onDeleteProject(this.clickedRow);
      }
    });
  }

  public onDeleteProject(project: Project): void {
    this.subscriptions.push(this.projectService.deleteProject(project.id).subscribe(
      (response: Project) => {

        this.loadProjects();
      }, (errorResponse: HttpErrorResponse) => {
        this.showErrorNotification(errorResponse.error.message);
      }
    ));
  }



}
