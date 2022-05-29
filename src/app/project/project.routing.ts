import {Routes} from "@angular/router";
import {DepartmentComponent} from "../organization/department/department.component";
import {ProjectsComponent} from "./projects/projects.component";

export const ProjectRoutes: Routes = [
  {path: '',
    children: [
      {
        path: 'projects',
        component: ProjectsComponent,
        data: {
          title: 'Projects',
          urls: [
            { title: 'Project', url: '/projects' },
            { title: 'Projects' }
          ],
        }
      },




    ]
  }
];
