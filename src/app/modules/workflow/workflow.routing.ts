import {Routes} from "@angular/router";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectEditComponent} from "./projects/project-edit/project-edit.component";
import {TicketComponent} from "./ticket/ticket.component";
import {ScreenGuard} from "../../guard/screen.guard";
import {TasksComponent} from "./task/tasks.component";
import {ApplicationConstants} from "../shared/application-constants";
import {KanbanComponent} from "./kanban/kanban.component";

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
          screen: ApplicationConstants.SCREEN_PROJECTS + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
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
          screen: ApplicationConstants.SCREEN_PROJECTS + '.' + ApplicationConstants.SCREEN_ACTION_EDIT,
          title: 'Project editor',
          urls: [
            { title: 'Project', url: '/workflow/project'},
            {title: 'Browser'}
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
            {title: 'Browser'}
          ],
        }
      },

      {
        path: 'tickets',
        component: TicketComponent,
        data: {
          title: 'Tickets',
          urls: [
            { title: 'Tickets', url: '/workflow/tickets'},
            {title: 'Add'}
          ],
        }
      },

      {
        path: 'kanban',
        component: KanbanComponent,
        data: {
          title: 'Kanban',
          urls: [
            { title: 'Kanban', url: '/workflow/kanban'}
          ],
        }
      },



    ]
  }
];
