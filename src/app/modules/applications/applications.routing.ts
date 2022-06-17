import {Routes} from "@angular/router";
import {ChatComponent} from "./chat/chat.component";
import {TestComponent} from "./test/test.component";

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
        path: 'test',
        component: TestComponent,
      }

    ]
  }


]
