import {Routes} from "@angular/router";
import {ChatComponent} from "./chat/chat.component";
import {TestComponent} from "./test/test.component";
import {CalendarComponent} from "./calendar/calendar.component";

export const ApplicationsRoutes: Routes = [

  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/applications',
        pathMatch: 'full'
      },
      {
        path: 'chat',
        component: ChatComponent,
      },

      {
        path: 'calendar',
        component: CalendarComponent,
      },

      {
        path: 'test',
        component: TestComponent,
      }

    ]
  }


]
