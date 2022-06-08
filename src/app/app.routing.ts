import { Routes } from '@angular/router';
import {LoginComponent} from "./authentication/login/login.component";
import {MainComponent} from "./layout/main/main.component";
import {RegisterComponent} from "./authentication/register/register.component";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {HomeComponent} from "./home/home.component";
import {ScreenGuard} from "./guard/screen.guard";

export const AppRoutes: Routes = [
  {path: '',
    component: MainComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home', component: HomeComponent,
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'organization',
        loadChildren: () => import('./organization/organization.module').then((m) => m.OrganizationModule),
      },
      {
        path: 'projects',
        loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule),
      }
    ]
  },

  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: '**', redirectTo: '/home'}

]
