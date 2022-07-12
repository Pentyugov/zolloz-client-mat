import { Routes } from '@angular/router';
import {LoginComponent} from "./authentication/login/login.component";
import {MainComponent} from "./layout/main/main.component";
import {RegisterComponent} from "./authentication/register/register.component";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {HomeComponent} from "./home/home.component";
import {ResetPasswordComponent} from "./authentication/reset-password/reset-password.component";

export const AppRoutes: Routes = [
  {path: '',
    component: MainComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'home', component: HomeComponent,
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'organization',
        loadChildren: () => import('./modules/organization/organization.module').then((m) => m.OrganizationModule),
      },
      {
        path: 'workflow',
        loadChildren: () => import('./modules/workflow/workflow.module').then((m) => m.WorkflowModule),
      },
      {
        path: 'applications',
        loadChildren: () => import('./modules/applications/applications.module').then((m) => m.ApplicationsModule),
      },
      {
        path: 'widgets',
        loadChildren: () => import('./modules/widgets/widgets.module').then((m) => m.WidgetsModule),
      }
    ]
  },

  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'reset-password',component: ResetPasswordComponent},
  {path: '**', redirectTo: '/home'}

]
