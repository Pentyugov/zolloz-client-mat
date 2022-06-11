import {Routes} from "@angular/router";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectEditComponent} from "./projects/project-edit/project-edit.component";
import {TicketComponent} from "./ticket/ticket.component";
import {ScreenGuard} from "../guard/screen.guard";

export const ProjectRoutes: Routes = [
  {path: '',
    children: [
      {
        path: '',
        redirectTo: '/projects',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Projects.Browse',
          title: 'Projects',
          urls: [
            { title: 'Projects' }
          ],
        }
      },
      {
        path: 'projects/edit',
        component: ProjectEditComponent,
        data: {
          screen: 'ProjectsEditor',
          title: 'Project editor',
          urls: [
            { title: 'Project', url: '/projects/project'},
            {title: 'Add'}
          ],
        }
      },
      {
        path: 'tickets',
        component: TicketComponent,
        data: {
          title: 'Tickets',
          urls: [
            { title: 'Project', url: '/projects/project'},
            {title: 'Add'}
          ],
        }
      },



    ]
  }
];
