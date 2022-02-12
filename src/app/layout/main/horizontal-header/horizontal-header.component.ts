import {Component, OnDestroy} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import {AuthenticationService} from "../../../service/authentication.service";
import {User} from "../../../model/user";
import {Router} from "@angular/router";
import {ApplicationService} from "../../../service/application.service";
import {ApplicationConstants, Locale} from "../../../shared/application-constants";
import {UserService} from "../../../service/user.service";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-horizontal-header',
  templateUrl: './horizontal-header.component.html',
  styleUrls: [],
})
export class HorizontalHeaderComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {

  };

  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM',
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM',
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM',
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM',
    },
  ];

  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM',
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM',
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM',
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM',
    },
  ];

  public selectedLocale: Locale;
  public locales: Locale[] = ApplicationConstants.APP_LOCALES;
  private subscriptions: Subscription[] = [];
  public currentUser: User = new User;
  constructor(private translate: TranslateService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private router: Router,
              private applicationService: ApplicationService) {
    this.selectedLocale = this.applicationService.loadApplicationLocale();
    translate.setDefaultLang(this.selectedLocale.code);
    this.currentUser = this.userService.getCurrentUser();
    this.subscriptions.push(this.userService.currentUser.subscribe(cu => this.currentUser = cu));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public changeLanguage(locale: Locale): void {
    this.translate.use(locale.code);
    this.selectedLocale = locale;
    this.applicationService.saveApplicationLocale(locale);
    window.location.reload();
  }

 public onLogout() {
    this.authenticationService.logOut(true);
 }


  navigate(route: string) {
    this.router.navigateByUrl(route).then(() => {

    });
  }
}
