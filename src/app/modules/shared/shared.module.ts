import {NgModule} from '@angular/core';

import {MenuItems} from './menu-item/menu-items';
import {HorizontalMenuItems} from './menu-item/horizontal-menu-items';

import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './accordion';
import {DeleteDialogComponent} from './dialog/delete-dialog/delete-dialog.component';
import {MaterialModule} from "../../material-module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app.module";
import {HttpClient} from "@angular/common/http";
import { SaveDialogComponent } from './dialog/save-dialog/save-dialog.component';

@NgModule({
  declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective, DeleteDialogComponent, SaveDialogComponent],
  exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
  providers: [MenuItems, HorizontalMenuItems],
  imports: [
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ]
})
export class SharedModule {}
