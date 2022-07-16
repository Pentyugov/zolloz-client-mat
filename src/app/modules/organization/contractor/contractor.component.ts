import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {MatDialog} from "@angular/material/dialog";
import {ContractorService} from "../../../service/contractor.service";
import {ApplicationConstants} from "../../shared/application-constants";
import {ScreenService} from "../../../service/screen.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Contractor} from "../../../model/contractor";
import {ContractorEditComponent} from "./contrator-edit/contractor-edit.component";
import {NewAbstractBrowser} from "../../shared/browser/new-abstract.browser";

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.scss']
})
export class ContractorComponent extends NewAbstractBrowser<Contractor> implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) override paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) override sort: MatSort = Object.create(null);
  public columnsToDisplay = ApplicationConstants.CONTRACTOR_TABLE_COLUMNS;

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              private contractorService: ContractorService) {
    super(injector,
      router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      ContractorEditComponent,
      contractorService,
      editor,
      screenService);

    this.id = 'screen$Contractor';
  }

  ngOnInit(): void {
    this.loadEntities();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
