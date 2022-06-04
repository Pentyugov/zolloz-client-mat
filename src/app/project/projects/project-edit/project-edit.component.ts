import {Component, Inject, OnInit, Optional} from '@angular/core';
import {AbstractEditor} from "../../../shared/screens/editor/AbstractEditor";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {Project} from "../../../model/project";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../model/user";
import {ProjectService} from "../../../service/project.service";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

interface Status {
  code: number,
  status: string
}


@Component({
  templateUrl: './project-edit.component.html',
})
export class ProjectEditComponent extends AbstractEditor implements OnInit {

  public editedProject: Project = new Project();
  public refreshing: boolean = false;
  public participantsDs: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  public participantsDisplayedColumns = ApplicationConstants.PROJECT_PARTICIPANTS_TABLE_COLUMNS;
  public closingDate: Date | null = null;
  public dueDate: Date | null = null;
  public dialog_data: any;

  public statuses: Status[] = [
    {
      code: 10,
      status: 'Open',
    },

    {
      code: 20,
      status: 'In progress',
    },

    {
      code: 30,
      status: 'Closed',
    },
  ]

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              private projectService: ProjectService,
              public dialogRef: MatDialogRef<ProjectEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    super(router, translate, eventNotificationService, applicationService);

    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this.dialog_data = data;
  }

  ngOnInit(): void {
    if (this.dialog_data.isNewItem) {
      this.initNewItem();
    }
    this.subscriptions.push()
  }

  openSaveDialog(){

  }

  public close() {
    this.dialogRef.close();
  }

  public onChangeStatus(): void {
    console.log(this.editedProject.status)
  }

  public onUpdateClosingDate(event: any): void {

  }

  public onUpdateDueDate(event: any): void {

  }

  private initNewItem() {
    console.log("initializing new item")
  }
}
