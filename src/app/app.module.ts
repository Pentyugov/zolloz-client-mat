import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from './authentication/login/login.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {RouterModule} from "@angular/router";
import {AppRoutes} from "./app.routing";
import {MainComponent} from './layout/main/main.component';
import {MaterialModule} from "./material-module";
import {SimpleNotificationsModule} from "angular2-notifications";
import {RegisterComponent} from './authentication/register/register.component';
import {HorizontalHeaderComponent} from './layout/main/horizontal-header/horizontal-header.component';
import {SharedModule} from "./modules/shared/shared.module";
import {SpinnerComponent} from "./modules/shared/spinner.component";
import {VerticalSidebarComponent} from "./layout/main/vertical-sidebar/vertical-sidebar.component";
import {HomeComponent} from './home/home.component';
import {BreadcrumbComponent} from './layout/main/breadcrumb/breadcrumb.component';
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import { NgxMaskModule, IConfig } from 'ngx-mask'
import {NgxPermissionsModule, NgxPermissionsRestrictStubModule} from "ngx-permissions";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {CommonModule} from "@angular/common";
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ApplicationsModule} from "./modules/applications/applications.module";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {UcWidgetModule} from "ngx-uploadcare-widget";
import {MatInputModule} from "@angular/material/input";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};
export const options: Partial<IConfig> | (() => Partial<IConfig>) | null = null;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
    SpinnerComponent,
    HorizontalHeaderComponent,
    VerticalSidebarComponent,
    HomeComponent,
    BreadcrumbComponent,
    ResetPasswordComponent,
  ],
  imports: [
    FormsModule,
    MaterialModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    UcWidgetModule,
    ReactiveFormsModule,
    MatInputModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxPermissionsRestrictStubModule,
    InfiniteScrollModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    SimpleNotificationsModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    RouterModule.forRoot(AppRoutes, {relativeLinkResolution: 'legacy'}),
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
    DragDropModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
