import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ApplicationsRoutes} from "../applications/applications.routing";
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
import { WidgetsBrowserComponent } from './widgest-browser/widgets-browser.component';
import {WidgetsRoutes} from "./widgets.routing";
import { WidgetsCalendarComponent } from './widgets-calendar/widgets-calendar.component';
import {ApplicationsModule} from "../applications/applications.module";

@NgModule({
  declarations: [


    WidgetsBrowserComponent,
        WidgetsCalendarComponent
  ],
  providers: [DatePipe],
  imports: [
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
  ],

  exports: [
    NgxPermissionsModule
  ],
  bootstrap:    [

  ]
})

export class WidgetsModule {

}
