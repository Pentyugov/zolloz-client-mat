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
  searchText: any;
  totalCount = -1;
  Closed = -1;
  InProgress = -1;
  Open = -1;

  public constructor(protected override router: Router,
                     protected override translate: TranslateService,
                     protected override eventNotificationService: EventNotificationService,
                     protected override applicationService: ApplicationService,
                     protected projectService: ProjectService,
                     protected projectEditor: MatDialog) {
    super(router, translate, eventNotificationService, applicationService)
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
      )
    );
  }

  private initDataSource(projects: Project[]): void {
    this.dataSource.data = projects;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (project: Project, filter: string) => {
      return project.status.toString().trim().toLowerCase() == filter;
    };
  }

  private initFilters(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.btnCategoryClick(Number(10));
    this.InProgress = this.btnCategoryClick(20);
    this.Closed = this.btnCategoryClick(30);
    this.btnCategoryClick(-1);
  }

  public btnCategoryClick(val: Number): number {
    this.clickedRow = null;
    if (val > 0) {
      this.dataSource.filter = val.toString().trim().toLowerCase();
      return this.dataSource.filteredData.length;
    } else {
      this.initDataSource(this.projects);
      return this.projects.length;
    }

  }

  public applyFilter(filterValue: string): void {
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
      data: {
        editedItem: editedItem,
        isNewItem: isNewItem
      }
    });

    editor.afterClosed().subscribe(() => {
      this.loadProjects();
    });
  }



}
