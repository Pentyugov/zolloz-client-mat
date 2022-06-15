import {Routes} from "@angular/router";
import {ProjectsComponent} from "../workflow/projects/projects.component";
import {ScreenGuard} from "../../guard/screen.guard";
import {ApplicationConstants} from "../../shared/application-constants";
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
        data: {
          title: 'Chat',
          urls: [
            {title: 'Chat'}
          ],
        }
      }

    ]
  }


]
