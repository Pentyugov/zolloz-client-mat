import {Routes} from "@angular/router";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectEditComponent} from "./projects/project-edit/project-edit.component";
import {TicketComponent} from "./ticket/ticket.component";
import {ScreenGuard} from "../guard/screen.guard";
import {TasksComponent} from "./task/tasks.component";

export const WorkflowRoutes: Routes = [
  {path: '',
    children: [
      {
        path: '',
        redirectTo: '/workflow',
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
            { title: 'Project', url: '/workflow/project'},
            {title: 'Add'}
          ],
        }
      },

      {
        path: 'tasks',
        component: TasksComponent,
        data: {
          title: 'Tasks',
          urls: [
            { title: 'Tasks', url: '/workflow/tasks'},
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
