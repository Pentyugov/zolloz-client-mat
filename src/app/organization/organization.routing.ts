import {Routes} from "@angular/router";
import {DepartmentComponent} from "./department/department.component";
import {EmployeeComponent} from "./employee/employee.component";
import {RoleComponent} from "./role/role.component";
import {UserComponent} from "./user/user.component";
import {UserEditComponent} from "./user/user-edit/user-edit.component";
import {UserAddComponent} from "./user/user-add/user-add.component";
import {DepartmentEditComponent} from "./department/department-edit/department-edit.component";
import {DepartmentAddComponent} from "./department/department-add/department-add.component";
import {EmployeeAddComponent} from "./employee/employee-add/employee-add.component";
import {EmployeeEditComponent} from "./employee/employee-edit/employee-edit.component";
import { PositionComponent } from './position/position.component';
import {ScreenGuard} from "../guard/screen.guard";

export const OrganizationRoutes: Routes = [
  {path: '',
    children: [
      {
        path: 'departments',
        component: DepartmentComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Department.Browser',
          title: 'Departments',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Departments' }
            ],
        }
      },

      {
        path: 'departments/edit/:id',
        component: DepartmentEditComponent,
        data: {
          title: 'Departments',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Departments', url: '/organization/departments'},
            {title: 'Edit'}
          ],
        }
      },

      {
        path: 'departments/add',
        component: DepartmentAddComponent,
        data: {
          title: 'Departments',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Departments', url: '/organization/departments'},
            {title: 'Add'}
          ],
        }
      },

      {
        path: 'employees',
        component: EmployeeComponent,
        data: {
          title: 'Employees',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Employees' }
            ],
        }
      },

      {
        path: 'employees/add',
        component: EmployeeAddComponent,
        data: {
          title: 'Employees',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Employees', url: '/organization/employees'},
            {title: 'Add'}
          ],
        }
      },


      {
        path: 'employees/edit/:id',
        component: EmployeeEditComponent,
        data: {
          title: 'Employees',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Employees', url: '/organization/employees'},
            {title: 'Edit'}
          ],
        }
      },

      {
        path: 'roles',
        component: RoleComponent,
        data: {
          title: 'Roles',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Roles' }
            ],
        }
      },

      {
        path: 'users',
        component: UserComponent,
        data: {
          title: 'Users',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Users' }
            ],
        }
      },

      {
        path: 'positions',
        component: PositionComponent,
        data: {
          title: 'Positions',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Positions' }
          ],
        }
      },

      {
        path: 'users/edit/:id',
        component: UserEditComponent,
        data: {
          title: 'Users',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Users', url: '/organization/users'},
            {title: 'Edit'}
            ],
        }
      },

      {
        path: 'users/add',
        component: UserAddComponent,
        data: {
          title: 'Users',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Users', url: '/organization/users'},
            {title: 'Add'}
            ],
        }
      },
    ]
  }
];
