import { Routes } from '@angular/router';
import {LoginComponent} from "./authentication/login/login.component";
import {MainComponent} from "./layout/main/main.component";
import {AuthenticationGuard} from "./guard/authentication.guard";
import {RegisterComponent} from "./authentication/register/register.component";

export const AppRoutes: Routes = [
  {path: 'main', component: MainComponent, canActivate: [AuthenticationGuard]},
  {path: 'login',component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},

]
