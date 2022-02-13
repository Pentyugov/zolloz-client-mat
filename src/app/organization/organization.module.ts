import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from './department/department.component';
import {RouterModule} from "@angular/router";
import {OrganizationRoutes} from "./organization.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import {RoleComponent, RoleContentComponent} from './role/role.component';
import {MaterialModule} from "../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../app.module";



@NgModule({
  declarations: [
    DepartmentComponent,
    EmployeeComponent,
    RoleComponent,
    RoleContentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OrganizationRoutes),
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class OrganizationModule { }
