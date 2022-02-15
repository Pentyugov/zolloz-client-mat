import {Routes} from "@angular/router";
import {DepartmentComponent} from "./department/department.component";
import {EmployeeComponent} from "./employee/employee.component";
import {RoleComponent} from "./role/role.component";
import {UserComponent} from "./user/user.component";
import {UserEditComponent} from "./user/user-edit/user-edit.component";

export const OrganizationRoutes: Routes = [
  {path: '',
    children: [
      {
        path: 'departments',
        component: DepartmentComponent,
        data: {
          title: 'Departments',
          urls: [{ title: 'Organization', url: '/organization' }, { title: 'Departments' }],
        }
      },

      {
        path: 'employees',
        component: EmployeeComponent,
        data: {
          title: 'Employees',
          urls: [{ title: 'Organization', url: '/organization' }, { title: 'Employees' }],
        }
      },

      {
        path: 'roles',
        component: RoleComponent,
        data: {
          title: 'Roles',
          urls: [{ title: 'Organization', url: '/organization' }, { title: 'Roles' }],
        }
      },

      {
        path: 'users',
        component: UserComponent,
        data: {
          title: 'Users',
          urls: [{ title: 'Organization', url: '/organization' }, { title: 'Users' }],
        }
      },

      {
        path: 'users/edit/:id',
        component: UserEditComponent,
        data: {
          title: 'Users',
          urls: [{ title: 'Organization', url: '/organization'}, { title: 'Users', url: '/organization/users'}, {title: 'Edit'}],
        }
      },
    ]
  }
];
