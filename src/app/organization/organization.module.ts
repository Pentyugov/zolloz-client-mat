import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
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
import {DepartmentEditComponent} from './department/department-edit/department-edit.component';
import {DepartmentAddComponent} from './department/department-add/department-add.component';
import {DepartmentEmployeeAddDialogComponent} from "./department/department-employee-add-dialog/department-employee-add-dialog.component";
import {DepartmentSaveDialogComponent} from './department/department-save-dialog/department-save-dialog.component';
import {EmployeeAddComponent} from './employee/employee-add/employee-add.component';
import {EmployeeSaveDialogComponent} from './employee/employee-save-dialog/employee-save-dialog.component';
import {EmployeePrefillDialogComponent} from "./employee/employee-prefill-dialog/employee-prefill-dialog.component";
import {EmployeeEditComponent} from './employee/employee-edit/employee-edit.component';
import {EmployeeDeleteDialogComponent} from './employee/employee-delete-dialog/employee-delete-dialog.component';
import {PositionComponent} from './position/position.component';
import {PositionDeleteDialogComponent} from './position/position-delete-dialog/position-delete-dialog.component';
import {PositionAddDialogComponent} from './position/position-add-dialog/position-add-dialog.component';
import { PositionEditDialogComponent } from './position/position-edit-dialog/position-edit-dialog.component';
import {NgxMaskModule} from "ngx-mask";


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
    EmployeeAddComponent,
    EmployeePrefillDialogComponent,
    EmployeeSaveDialogComponent,
    EmployeeEditComponent,
    EmployeeDeleteDialogComponent,
    PositionComponent,
    PositionDeleteDialogComponent,
    PositionAddDialogComponent,
    PositionEditDialogComponent,
  ],
  providers: [DatePipe],
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
        NgxMaskModule,
    ],
})
export class OrganizationModule { }
