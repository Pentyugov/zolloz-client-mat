import {Component, OnDestroy} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {WidgetsCalendarComponent} from "../modules/widgets/widgets-calendar/widgets-calendar.component";
import {WidgetsMyTasksComponent} from "../modules/widgets/widgets-my-tasks/widgets-my-tasks.component";
import {
  WidgetsMyProductivityComponent
} from "../modules/widgets/widgets-my-productivity/widgets-my-productivity.component";
import {WidgetSettings} from "../model/widget-settings";
import {ApplicationService} from "../service/application.service";
import {Subscription} from "rxjs";
import {UserSettings} from "../model/user-settings";

export interface BucketWidgetData {
  type: number;
  component: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private widgetSettings: WidgetSettings[] = [];
  public bucket_0: BucketWidgetData[] = []
  public bucket_1: BucketWidgetData[] = []

  constructor(public applicationService: ApplicationService) {
    this.loadUserSettings();
  }

  ngOnDestroy(): void {
     this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadUserSettings(): void {
    this.subscriptions.push(this.applicationService.loadUserSettings().subscribe((userSettings: UserSettings) => {
      this.widgetSettings = userSettings.widgetSettings;
      for (let widgetSetting of this.widgetSettings) {
        this.addWidgetToBucket(widgetSetting);
      }
    }));
  }

  private addWidgetToBucket(widgetSetting: WidgetSettings): void {
    let bucketWidgetData: BucketWidgetData = {
      type: widgetSetting.type,
      component: this.getComponentByType(widgetSetting.type)
    };

    if (widgetSetting.bucket === 0) {
      this.bucket_0[widgetSetting.index] = bucketWidgetData;
    } else if (widgetSetting.bucket === 1) {
      this.bucket_1[widgetSetting.index] = bucketWidgetData;
    }

  }

  private getComponentByType(type: number): any {
    switch (type) {
      case 10 : return WidgetsCalendarComponent;
      case 20 : return WidgetsMyTasksComponent;
      case 30 : return WidgetsMyProductivityComponent;
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.updateWidgetSettings(event);
  }

  private updateWidgetSettings(event: any): void {
    let settings: WidgetSettings[] = [];
    for (let i = 0; i < this.bucket_0.length; i++) {
      let ws = this.bucket_0[i];
      let widgetSettings = new WidgetSettings();
      widgetSettings.type = ws.type;
      widgetSettings.bucket = 0;
      widgetSettings.index = i;
      settings.push(widgetSettings);
    }

    for (let i = 0; i < this.bucket_1.length; i++) {
      let ws = this.bucket_1[i];
      let widgetSettings = new WidgetSettings();
      widgetSettings.type = ws.type;
      widgetSettings.bucket = 1;
      widgetSettings.index = i;
      settings.push(widgetSettings);
    }

    let userSettings = this.applicationService.getUserSettings();
    userSettings.widgetSettings = settings;
    this.subscriptions.push(this.applicationService.saveUserSettings(userSettings).subscribe(
      (response: UserSettings) => {
        this.applicationService.changeSettings(response);
      }
    ));
  }

}
