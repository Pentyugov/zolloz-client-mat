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
import {NgxMaskModule} from 'ngx-mask';
import {NgxPermissionsModule, NgxPermissionsRestrictStubModule} from "ngx-permissions";
import {ApplicationsRoutes} from "./applications.routing";
import {ChatComponent} from './chat/chat.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {TestComponent} from './test/test.component';
import {CalendarComponent} from './calendar/calendar.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {CalendarEditComponent} from './calendar/calendar-edit/calendar-edit.component';


@NgModule({
  declarations: [
    ChatComponent,
    TestComponent,
    CalendarComponent,
    CalendarEditComponent
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(ApplicationsRoutes),
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
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxPermissionsRestrictStubModule,
    InfiniteScrollModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
  ],

  exports: [
    NgxPermissionsModule
  ],
  bootstrap:    [ TestComponent ]
})



export class ApplicationsModule {

}
