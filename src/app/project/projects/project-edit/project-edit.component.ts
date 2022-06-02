import {Component, Inject, OnInit, Optional} from '@angular/core';
import {AbstractEditor} from "../../../shared/screens/editor/AbstractEditor";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {Project} from "../../../model/project";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {ProjectService} from "../../../service/project.service";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Role} from "../../../model/role";


@Component({
  templateUrl: './project-edit.component.html',
})
export class ProjectEditComponent extends AbstractEditor implements OnInit {

  public editedProject: Project = new Project();
  public refreshing: boolean = false;
  public participantsDs: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  public participantsDisplayedColumns = ApplicationConstants.PROJECT_PARTICIPANTS_TABLE_COLUMNS;

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
  }

  ngOnInit(): void {
    this.subscriptions.push()
  }

  openSaveDialog(){

  }

  public close() {
    this.dialogRef.close();
  }
}
