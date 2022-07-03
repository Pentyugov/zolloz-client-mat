import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import {ProfileRoutes} from "./profile.routing";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import { UserInfoComponent } from './profile-components/user-info/user-info.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../../app.module";
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import {
  ProfileInfoComponent,
  UpdateProfileDialogComponent
} from './profile-components/profile-info/profile-info.component';
import { UserSettingsComponent } from './profile-components/user-settings/user-settings.component';




@NgModule({
  declarations: [
    ProfileComponent,
    UserInfoComponent,
    ProfileInfoComponent,
    UserSettingsComponent,
    UpdateProfileDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    UcWidgetModule,
    RouterModule.forChild(ProfileRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ]
})
export class ProfileModule { }
