import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-item/menu-items';
import {AuthenticationService} from "../../../service/authentication.service";
import {User} from "../../../model/user";
import {UserService} from "../../../service/user.service";
import {ScreenService} from "../../../service/screen.service";

@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',
  styleUrls: [],
})
export class VerticalSidebarComponent implements OnDestroy {

  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;

  @Input()
  showClass: boolean = false;

  @Output()
  notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _mobileQueryListener: () => void;
  status = true;
  showMenu = '';
  itemSelect: number[] = [];
  parentIndex = 0;
  childIndex = 0;

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  subclickEvent(): void {
    this.status = true;
  }
  scrollToTop(): void {
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }

  @Input() public currentUser: User = new User;
  constructor(changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public menuItems: MenuItems,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              public screenService: ScreenService,) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);

  }

  handleNotify() {
    if (window.innerWidth < 1024) {
      this.notify.emit(!this.showClass);
    }
  }

  getUsername(): string {
    if (!this.currentUser.lastName && !this.currentUser.firstName) {
      return this.currentUser.username;
    } else {
      return this.currentUser.firstName + this.currentUser.lastName;
    }
  }

}
