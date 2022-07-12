import {Routes} from "@angular/router";
import {WidgetsBrowserComponent} from "./widgest-browser/widgets-browser.component";

export const WidgetsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: WidgetsBrowserComponent
      },

    ]
  }
]
