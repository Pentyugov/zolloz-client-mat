import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {WidgetsCalendarComponent} from "../modules/widgets/widgets-calendar/widgets-calendar.component";
import {WidgetsMyTasksComponent} from "../modules/widgets/widgets-my-tasks/widgets-my-tasks.component";
import {
  WidgetsMyProductivityComponent
} from "../modules/widgets/widgets-my-productivity/widgets-my-productivity.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public widgets_1 = [
    {type: 'Calendar', component: WidgetsCalendarComponent}
  ]

  public widgets_2 = [
    {type: 'MyProductivity', component: WidgetsMyProductivityComponent},
    {type: 'MyTasks', component: WidgetsMyTasksComponent}
  ]

  constructor() {

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
  }

}
