import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractEditor} from "../../../shared/editor/abstract-editor";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {ApplicationService} from "../../../../service/application.service";
import {Project} from "../../../../model/project";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../../model/user";
import {ProjectService} from "../../../../service/project.service";
import {ApplicationConstants} from "../../../shared/application-constants";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Contractor} from "../../../../model/contractor";
import {UserService} from "../../../../service/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ContractorService} from "../../../../service/contractor.service";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ProjectAddParticipantsComponent} from "./addparticipants/project-add-participants.component";
import {SaveDialogComponent} from "../../../shared/dialog/save-dialog/save-dialog.component";

@Component({
  templateUrl: './project-edit.component.html',
})
export class ProjectEditComponent extends AbstractEditor implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  public editedProject: Project = new Project();
  public projectManagers: User[] = [];
  public contractors: Contractor[] = [];
  public participantsDs: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  public participantsDisplayedColumns = ApplicationConstants.PROJECT_PARTICIPANTS_TABLE_COLUMNS;
  public conclusionDate: Date | null = null;
  public dueDate: Date | null = null;
  public dialog_data: any;

  public statuses: Object[];

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              private userService: UserService,
              private projectService: ProjectService,
              private contractorService: ContractorService,
              public dialogRef: MatDialogRef<ProjectEditComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    super(router, translate, eventNotificationService, applicationService, dialog);

    this.refreshing = applicationService.getRefreshing();
    this.subscriptions.push(applicationService.userSettings.subscribe(us => translate.use(us.locale)));
    this.dialog_data = data;

    this.statuses = ApplicationConstants.PROJECT_STATUSES;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    if (!this.isNewItem()) {
      this.editedProject = this.data.editedItem;
      this.participantsDs.data = this.editedProject.participants;
      if (this.editedProject.conclusionDate) {
        this.conclusionDate = new Date(this.editedProject.conclusionDate);
      }

      if (this.editedProject.dueDate) {
        this.dueDate = new Date(this.editedProject.dueDate);
      }
    }

    this.loadContractors();
    this.loadProjectManagers();
  }

  public openSaveDialog() {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: ApplicationConstants.DIALOG_WIDTH,
      panelClass: this.isDarkMode ? 'dark' : ''
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.event === ApplicationConstants.DIALOG_ACTION_SAVE) {
          if (this.isNewItem()) {
            this.onCreateProject();
          } else {
            this.onUpdateProject();
          }

        }
      }
    });
  }

  public openAddParticipantsDialog(action: string, data: any): void {
    data.action = action;
    data.participants = this.participantsDs.data;
    const dialogRef = this.dialog.open(ProjectAddParticipantsComponent, {
      data: data,
      panelClass: this.isDarkMode ? 'dark' : '',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event.action === ApplicationConstants.DIALOG_ACTION_SAVE) {
        console.log(result.event.data);
        this.initDataSource(result.event.data);
      }
    });
  }

  private initDataSource(participants: User[]): void {
    this.participantsDs = new MatTableDataSource<User>(participants);
    this.participantsDs.paginator = this.paginator;
    this.participantsDs.sort = this.sort;
    this.editedProject.participants = participants;
  }

  public onCreateProject(): void {
    this.subscriptions.push(this.projectService.add(this.editedProject).subscribe(
      (response: Project) => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Project: ${response.name} was created successfully`);
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
      }));
    this.close();
  }

  public onUpdateProject(): void {
    this.subscriptions.push(this.projectService.update(this.editedProject).subscribe(
      (response: Project) => {
        this.eventNotificationService
          .showSuccessNotification(EventNotificationCaptionEnum.SUCCESS, `Project: ${response.name} was updated successfully`);
        this.close();
      }, (errorResponse: HttpErrorResponse) => {
        this.eventNotificationService
          .showErrorNotification(EventNotificationCaptionEnum.ERROR, errorResponse.error.message);
        this.close();
      }));

  }

  public close() {
    this.dialogRef.close({
      event: {
        action: ApplicationConstants.DIALOG_ACTION_SAVE
      }
    });
  }

  public isNewItem(): boolean {
    return this.dialog_data.isNewItem;
  }

  public onUpdateConclusionDate(event: any): void {
    this.conclusionDate = new Date(Date.parse(event.target.value))
    this.editedProject.conclusionDate = this.conclusionDate;
  }

  public onUpdateDueDate(event: any): void {
    this.dueDate = new Date(Date.parse(event.target.value))
    this.editedProject.dueDate = this.dueDate;
  }

  public loadProjectManagers(): void {
    this.subscriptions.push(this.userService.getAllWithRole(ApplicationConstants.ROLE_PROJECT_MANAGER).subscribe((response: User[]) => {
      this.projectManagers = response;
      this.editedProject.projectManager = this.projectManagers.find(d => d.id === this.editedProject.projectManager?.id)
    }, (errorResponse: HttpErrorResponse) => {
      this.showErrorNotification(errorResponse.error.message);
    }));
  }

  public loadContractors(): void {
    this.subscriptions.push(this.contractorService.getAll().subscribe((response: Contractor[]) => {
      this.contractors = response;
      this.editedProject.contractor = this.contractors.find(d => d.id === this.editedProject.contractor?.id)
    }, (errorResponse: HttpErrorResponse) => {
      this.showErrorNotification(errorResponse.error.message);
    }));
  }

}

