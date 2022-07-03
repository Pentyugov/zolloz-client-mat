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
import {ScreenGuard} from "../../guard/screen.guard";
import {ApplicationConstants} from "../shared/application-constants";
import {ContractorComponent} from "./contractor/contractor.component";

export const OrganizationRoutes: Routes = [
  {path: '',
    children: [
      {
        path: 'departments',
        component: DepartmentComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: ApplicationConstants.SCREEN_DEPARTMENT + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
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
          screen: ApplicationConstants.SCREEN_DEPARTMENT + '.' + ApplicationConstants.SCREEN_ACTION_EDIT,
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
          screen: ApplicationConstants.SCREEN_DEPARTMENT + '.' + ApplicationConstants.SCREEN_ACTION_CREATE,
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
          screen: ApplicationConstants.SCREEN_EMPLOYEE + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
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
          screen: ApplicationConstants.SCREEN_EMPLOYEE + '.' + ApplicationConstants.SCREEN_ACTION_CREATE,
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
          screen: ApplicationConstants.SCREEN_EMPLOYEE + '.' + ApplicationConstants.SCREEN_ACTION_EDIT,
          title: 'Employees',
          urls: [
            { title: 'Organization', url: '/organization'},
            { title: 'Employees', url: '/organization/employees'},
            {title: 'Edit'}
          ],
        }
      },

      {
        path: 'contractors',
        component: ContractorComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: ApplicationConstants.SCREEN_CONTRACTOR + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
          title: 'Contractors',
          urls: [
            { title: 'Organization', url: '/organization' },
            { title: 'Contractors' }
          ],
        }
      },

      {
        path: 'roles',
        component: RoleComponent,
        canActivate: [ScreenGuard],
        data: {
          screen: ApplicationConstants.SCREEN_ROLE + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
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
          screen: ApplicationConstants.SCREEN_USER + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
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
          screen: ApplicationConstants.SCREEN_USER + '.' + ApplicationConstants.SCREEN_ACTION_EDIT,
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
          screen: ApplicationConstants.SCREEN_USER + '.' + ApplicationConstants.SCREEN_ACTION_CREATE,
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
          screen: ApplicationConstants.SCREEN_POSITION + '.' + ApplicationConstants.SCREEN_ACTION_BROWSE,
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
