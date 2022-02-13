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

  dark = false;
  minisidebar = false;
  horizontal = false;

  showHide = false;
  sidebarOpened = false;
  status = false;

  public showSearch = false;
  public config: PerfectScrollbarConfigInterface = {};
  private readonly _mobileQueryListener: () => void;
  public userSettings: UserSettings;
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
    this.subscriptions.push(this.applicationService.userSettings.subscribe(us => {
      this.userSettings = us;
    }));
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public changeDarkMode(): void {
    const body = document.getElementsByTagName('body')[0];
    if (this.userSettings.darkTheme) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
    this.applySettings(this.userSettings.themeColor);
  }

  public changeMiniSidebar(): void {
    this.applySettings(this.userSettings.themeColor);
  }

  public loadUserSettings(): void {
    this.applicationService.loadUserSettings().subscribe(
      (response: UserSettings) => {
        this.applicationService.changeSettings(response);
        this.userSettings = this.applicationService.getUserSettings();
      }
    );
  }

  public applySettings(theme: number = this.userSettings.themeColor): void {
    this.userSettings.themeColor = theme;
    this.applicationService.saveUserSettings(this.userSettings).subscribe(
      (response: UserSettings) => {
        this.applicationService.changeSettings(response);
        this.userSettings = this.applicationService.getUserSettings();
      }
    );
  }


}

