import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import {MenuItems} from "../../shared/menu-item/menu-items";
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: []
})
export class MainComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  dir = 'ltr';
  dark = false;
  minisidebar = false;
  boxed = false;
  horizontal = false;

  green = false;
  blue = false;
  danger = false;
  showHide = false;
  url = '';
  sidebarOpened = false;
  status = false;

  public showSearch = false;
  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;

  public currentUser: User;

  constructor(public router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public menuItems: MenuItems,
              public authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.getUserFromLocalCache();
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.dark = false;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  clickEvent(): void {
    this.status = !this.status;
  }

  darkClick() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('dark');
  }


}

