import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import {ProfileRoutes} from "./profile.routing";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { UserInfoComponent } from './profile-components/user-info/user-info.component';



@NgModule({
  declarations: [
    ProfileComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule.forChild(ProfileRoutes),

  ]
})
export class ProfileModule { }
