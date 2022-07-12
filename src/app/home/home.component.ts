import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CalendarComponent} from "../modules/applications/calendar/calendar.component";
import {WidgetsCalendarComponent} from "../modules/widgets/widgets-calendar/widgets-calendar.component";

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
    {type: 'Calendar', component: WidgetsCalendarComponent}
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
