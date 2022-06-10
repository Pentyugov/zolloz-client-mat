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
          screen: 'screen$Department.Browse',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Department.Edit',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Department.Create',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Employee.Browse',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Employee.Create',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Employee.Edit',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Role.Browse',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$User.Browse',
          title: 'Users',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Users' }
            ],
        }
      },

      {
        path: 'users/edit/:id',
        component: UserEditComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$User.Edit',
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
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$User.Create',
          title: 'Users',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Users', url: '/organization/users'},
            {title: 'Add'}
          ],
        }
      },

      {
        path: 'positions',
        component: PositionComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: 'screen$Position.Browse',
          title: 'Positions',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Positions' }
          ],
        }
      },


    ]
  }
];
