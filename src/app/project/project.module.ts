import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from "../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../app.module";
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MatInputModule} from "@angular/material/input";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {UcWidgetModule} from "ngx-uploadcare-widget";
import {ProjectRoutes} from "./project.routing";
import { ProjectsComponent } from './projects/projects.component';
import {ProjectEditComponent, ProjectSaveConfirmComponent} from './projects/project-edit/project-edit.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectEditComponent,
    ProjectSaveConfirmComponent
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(ProjectRoutes),
    FormsModule,
    MaterialModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    UcWidgetModule,
    ReactiveFormsModule,
    MatInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaskModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class ProjectModule { }
