import {Routes} from "@angular/router";
import {ChatComponent} from "./chat/chat.component";

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
      }

    ]
  }


]
