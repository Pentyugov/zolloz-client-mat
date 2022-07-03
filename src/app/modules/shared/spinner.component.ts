import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {ApplicationService} from "../../service/application.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-spinner',
  template: `<div [class]="{
                            'preloader' : !isDarkMode,
                            'preloader-dark' : isDarkMode
                            }"
                            *ngIf="isSpinnerVisible">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>`,
  encapsulation: ViewEncapsulation.None,
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = true;
  public isDarkMode = false;
  private subscriptions: Subscription[] = [];
  @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(@Inject(DOCUMENT) private document: Document,
              private router: Router,
              protected applicationService: ApplicationService,) {
    this.subscriptions.push(this.applicationService.darkMode.subscribe(dm => this.isDarkMode = dm));

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      },
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.isSpinnerVisible = false;
  }
}
