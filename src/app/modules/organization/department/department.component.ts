import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Department} from "../../../model/department";
import {DepartmentService} from "../../../service/department.service";
import {ApplicationService} from "../../../service/application.service";
import {EventNotificationService} from "../../../service/event-notification.service";
import {TranslateService} from "@ngx-translate/core";
import {ApplicationConstants} from "../../shared/application-constants";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ScreenService} from "../../../service/screen.service";
import {DepartmentEditComponent} from "./department-edit/department-edit.component";
import {NewAbstractBrowser} from "../../shared/browser/new-abstract.browser";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent extends NewAbstractBrowser<Department> implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) override paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) override sort: MatSort = Object.create(null);
  public columnsToDisplay = ApplicationConstants.DEPARTMENT_TABLE_COLUMNS;

  constructor(public override router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              private departmentService: DepartmentService) {
    super(router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      DepartmentEditComponent,
      departmentService,
      editor,
      screenService);

    this.id = 'screen$Department';
  }

  ngOnInit(): void {
    this.loadEntities();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}

