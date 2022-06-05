import {Routes} from "@angular/router";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectEditComponent} from "./projects/project-edit/project-edit.component";

export const ProjectRoutes: Routes = [
  {path: '',
    children: [
      {
        path: 'projects',
        component: ProjectsComponent,
        data: {
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
          title: 'Project editor',
          urls: [
            { title: 'Project', url: '/projects/project'},
            {title: 'Add'}
          ],
        }
      },



    ]
  }
];
