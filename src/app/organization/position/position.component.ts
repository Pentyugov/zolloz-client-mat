import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractBrowser } from '../../shared/screens/browser/AbstractBrowser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventNotificationService } from '../../service/event-notification.service';
import { ApplicationService } from '../../service/application.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent extends AbstractBrowser implements OnInit, OnDestroy {

  constructor(router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService) {
    super(router, translate, eventNotificationService, applicationService)
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public loadPositions(): void {

  }


}
