import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {RouterModule} from "@angular/router";
import {AppRoutes} from "./app.routing";
import { MainComponent } from './layout/main/main.component';
import {MaterialModule} from "./material-module";
import {SimpleNotificationsModule} from "angular2-notifications";
import { RegisterComponent } from './authentication/register/register.component';

export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    SimpleNotificationsModule.forRoot(),
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
