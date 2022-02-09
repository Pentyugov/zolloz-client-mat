import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from './department/department.component';
import {RouterModule} from "@angular/router";
import {OrganizationRoutes} from "./organization.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee/employee.component';
import {RoleComponent} from './role/role.component';
import {MaterialModule} from "../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";



@NgModule({
  declarations: [
    DepartmentComponent,
    EmployeeComponent,
    RoleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OrganizationRoutes),
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
})
export class OrganizationModule { }
