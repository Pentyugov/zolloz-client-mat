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
import { NgxMaskModule } from 'ngx-mask';
import {NgxPermissionsModule, NgxPermissionsRestrictStubModule} from "ngx-permissions";
import {ApplicationsRoutes} from "./applications.routing";
import { ChatComponent } from './chat/chat.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { TestComponent } from './test/test.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarFormDialogComponent } from './calendar/calendar-form-dialog/calendar-form-dialog.component';
import { CalendarDialogComponent } from './calendar/calendar-dialog/calendar-dialog.component';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


@NgModule({
  declarations: [
    ChatComponent,
    TestComponent,
    CalendarComponent,
    CalendarFormDialogComponent,
    CalendarDialogComponent
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
  ],

  exports: [
    NgxPermissionsModule
  ],
  bootstrap:    [ TestComponent ]
})



export class ApplicationsModule {

}
