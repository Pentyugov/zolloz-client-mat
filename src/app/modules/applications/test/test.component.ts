import {Component, Injector, OnInit} from '@angular/core';
import {AbstractWindow} from "../../shared/window/abstract-window";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent extends AbstractWindow implements OnInit {
  ngOnInit(): void {
    console.log('test started');
  }

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog) {
    super(injector, router, translate, eventNotificationService, applicationService, dialog);

  }
}
