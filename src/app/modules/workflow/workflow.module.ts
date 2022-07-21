import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from "../../material-module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {HttpLoaderFactory} from "../../app.module";
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {MatInputModule} from "@angular/material/input";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {UcWidgetModule} from "ngx-uploadcare-widget";
import {WorkflowRoutes} from "./workflow.routing";
import {ProjectsComponent} from './projects/projects.component';
import {ProjectEditComponent} from './projects/project-edit/project-edit.component';
import {NgxMaskModule} from 'ngx-mask';
import {
  ProjectAddParticipantsComponent
} from './projects/project-edit/addparticipants/project-add-participants.component'
import {ProjectDeleteDialogComponent} from "./projects/project-delete-dialog/project-delete-dialog.component";
import {TicketComponent} from './ticket/ticket.component';
import {NgxPermissionsModule, NgxPermissionsRestrictStubModule} from "ngx-permissions";
import {TasksComponent} from './task/tasks.component';
import {TaskEditComponent} from './task/tast-edit/task-edit.component';
import {TaskExecutionDialogComponent} from './task/task-execution-dialog/task-execution-dialog.component';
import {NgxMatDatetimePickerModule} from "@angular-material-components/datetime-picker";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { KanbanComponent } from './kanban/kanban.component';
import {DragDropModule} from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectEditComponent,
    ProjectAddParticipantsComponent,
    ProjectDeleteDialogComponent,
    TicketComponent,
    TasksComponent,
    TaskEditComponent,
    TaskExecutionDialogComponent,
    KanbanComponent
  ],
  providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(WorkflowRoutes),
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
        NgxPermissionsRestrictStubModule,
        NgxMatDatetimePickerModule,
        MatSnackBarModule,
        DragDropModule,
    ],

  exports: [
    NgxPermissionsModule,
    TasksComponent
  ]
})
export class WorkflowModule { }
