import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../../material-module";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {FlexLayoutModule} from "@angular/flex-layout";
import {UcWidgetModule} from "ngx-uploadcare-widget";
import {MatInputModule} from "@angular/material/input";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgxMaskModule} from "ngx-mask";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app.module";
import {HttpClient} from "@angular/common/http";
import {NgxPermissionsModule, NgxPermissionsRestrictStubModule} from "ngx-permissions";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {WidgetsBrowserComponent} from './widgest-browser/widgets-browser.component';
import {WidgetsRoutes} from "./widgets.routing";
import {WidgetsCalendarComponent} from './widgets-calendar/widgets-calendar.component';
import {ApplicationsModule} from "../applications/applications.module";
import {WidgetsMyTasksComponent} from './widgets-my-tasks/widgets-my-tasks.component';
import {WorkflowModule} from "../workflow/workflow.module";
import {WidgetsMyProductivityComponent} from "./widgets-my-productivity/widgets-my-productivity.component";
import {NgChartsModule} from "ng2-charts";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [


    WidgetsBrowserComponent,
        WidgetsCalendarComponent,
        WidgetsMyTasksComponent,
    WidgetsMyProductivityComponent
  ],
  providers: [DatePipe],
  imports: [
    BrowserModule,
    NgChartsModule,
    CommonModule,
    RouterModule.forChild(WidgetsRoutes),
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
    InfiniteScrollModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    ApplicationsModule,
    WorkflowModule,
  ],

  exports: [
    NgxPermissionsModule
  ],
  bootstrap:    [

  ]
})

export class WidgetsModule {

}
