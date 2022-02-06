import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthenticationService} from "../../service/authentication.service";
import {LoginRequest} from "../../model/login-request";
import {Subscription} from "rxjs";
import {EventNotificationService} from "../../service/event-notification.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {User} from "../../model/user";
import {HeaderType} from "../../enum/header-type.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading = false;
  private subscriptions: Subscription[] = [];
  public loginForm: FormGroup = Object.create(null);
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private eventNotificationService: EventNotificationService) {

  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/main');
    } else {
      this.router.navigateByUrl('/login');
      this.loginForm = this.formBuilder.group({
        username: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])],
      });
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLogin(loginRequest: LoginRequest): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(loginRequest).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          if (token && response.body) {
            this.authenticationService.saveToken(token);
            this.authenticationService.addUserToLocalCache(response.body);
            this.router.navigateByUrl('/main');
            this.showLoading = false;
          }

        },
        (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }
}
