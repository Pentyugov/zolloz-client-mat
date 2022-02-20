import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DepartmentComponent, DepartmentDeleteDialogComponent} from './department/department.component';
import {RouterModule} from "@angular/router";
import {OrganizationRoutes} from "./organization.routing";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EmployeeComponent} from './employee/employee.component';
import {RoleComponent, RoleContentComponent} from './role/role.component';
import {MaterialModule} from "../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../app.module";
import {UserComponent, UserDeleteDialogComponent} from './user/user.component';
import {UserEditComponent, UserEditDialogComponent} from './user/user-edit/user-edit.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MatInputModule} from "@angular/material/input";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {UcWidgetModule} from "ngx-uploadcare-widget";
import {UserAddComponent, UserAddDialogComponent} from './user/user-add/user-add.component';
import { DepartmentEditComponent } from './department/department-edit/department-edit.component';
import {DepartmentAddComponent
} from './department/department-add/department-add.component';
import {DepartmentEmployeeAddDialogComponent} from "./department/department-employee-add-dialog/department-employee-add-dialog.component";
import { DepartmentSaveDialogComponent } from './department/department-save-dialog/department-save-dialog.component';


@NgModule({
  declarations: [
    DepartmentComponent,
    EmployeeComponent,
    RoleComponent,
    RoleContentComponent,
    UserComponent,
    UserEditComponent,
    UserEditDialogComponent,
    UserAddDialogComponent,
    UserDeleteDialogComponent,
    UserAddComponent,
    DepartmentEditComponent,
    DepartmentAddComponent,
    DepartmentDeleteDialogComponent,
    DepartmentEmployeeAddDialogComponent,
    DepartmentSaveDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OrganizationRoutes),
    FormsModule,
    MaterialModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    UcWidgetModule,
    ReactiveFormsModule,
    MatInputModule,
    NgMultiSelectDropDownModule.forRoot(),
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
