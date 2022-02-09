import { NgModule } from '@angular/core';

import { MenuItems } from './menu-item/menu-items';
import { HorizontalMenuItems } from './menu-item/horizontal-menu-items';

import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';

@NgModule({
  declarations: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
  exports: [AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective],
  providers: [MenuItems, HorizontalMenuItems],
})
export class SharedModule {}
