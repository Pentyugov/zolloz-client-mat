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
import {NgxPermissionsModule} from "ngx-permissions";
import {InfiniteScrollModule} from "ngx-infinite-scroll";

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
  ],
  imports: [
    NgxMaskModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedModule,
    PerfectScrollbarModule,
    SimpleNotificationsModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    InfiniteScrollModule,
    RouterModule.forRoot(AppRoutes, { relativeLinkResolution: 'legacy' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
