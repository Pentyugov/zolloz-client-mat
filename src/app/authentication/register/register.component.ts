import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {SignUpRequest} from "../../model/sign-up-request";
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {EventNotificationService} from "../../service/event-notification.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading = false;
  public registerForm: FormGroup = Object.create(null);
  private subscriptions: Subscription[] = [];
  public password: string = '';
  public confirmPassword: string = '';
  public passwordMatches: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private eventNotificationService: EventNotificationService) {

  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/').then(()=> {});
    } else {
      this.registerForm = this.fb.group({
        username: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])],
        confirmPassword: [null, Validators.compose([Validators.required])],
      });
    }

  }

  onRegister(signUpRequest: SignUpRequest): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(signUpRequest).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.eventNotificationService.showSuccessNotification('Success', `A new account was created for ${response.firstName}.`);
          this.router.navigateByUrl('/login').then(()=> {});
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  public isPasswordMatches(): void {
    this.passwordMatches = this.password === this.confirmPassword;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
