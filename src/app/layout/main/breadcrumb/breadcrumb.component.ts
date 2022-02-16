import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
  ]
})
export class BreadcrumbComponent {
pageInfo: Data = Object.create(null);
constructor(
  public translate: TranslateService,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private titleService: Title,
) {
  this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .pipe(map(() => this.activatedRoute))
    .pipe(
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
    )
    .pipe(filter((route) => route.outlet === 'primary'))
    .pipe(mergeMap((route) => route.data))
    // tslint:disable-next-line - Disables all
    .subscribe((event) => {
      // tslint:disable-next-line - Disables all
      this.titleService.setTitle(event['title']);
      this.pageInfo = event;
    });
}
}

