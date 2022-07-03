import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationService} from "../../../service/application.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public refreshing = true;
  private subscriptions: Subscription[] = [];
  constructor(private applicationService: ApplicationService) {
    this.refreshing = this.applicationService.getRefreshing();
    this.subscriptions.push(this.applicationService.refreshing.subscribe(refreshing => this.refreshing = refreshing));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
