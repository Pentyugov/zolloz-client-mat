import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {UserService} from "../../service/user.service";
import {UserSettings} from "../../model/user-settings";
import {Subscription} from "rxjs";
import {ApplicationService} from "../../service/application.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: []
})
export class MainComponent implements OnInit, OnDestroy {
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
  private readonly _mobileQueryListener: () => void;
  private userSettings: UserSettings;
  private subscriptions: Subscription[] = [];

  public currentUser: User;

  constructor(public router: Router,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public authenticationService: AuthenticationService,
              public userService: UserService,
              private applicationService: ApplicationService) {

    this.loadUserSettings();
    this.currentUser = this.authenticationService.getUserFromLocalCache();
    this.userService.changeCurrentUser(this.currentUser);
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.dark = false;

    this.userSettings = this.applicationService.getUserSettings();
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => this.userSettings = us));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public clickEvent(): void {
    this.status = !this.status;
  }

  public darkClick() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('dark');
  }

  public loadUserSettings(): void {
    this.applicationService.loadUserSettings().subscribe(
      (response: UserSettings) => {
        this.applicationService.changeSettings(response);
        this.userSettings = this.applicationService.getUserSettings();
        console.log(this.userSettings);
      }
    );
  }


}

