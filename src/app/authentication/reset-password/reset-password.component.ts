import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {EventNotificationService} from "../../service/event-notification.service";
import {ResetPasswordRequest} from "../../model/reset-password-request";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private email: string = '';
  public showLoading = false;
  private subscriptions: Subscription[] = [];
  public resetPasswordForm: FormGroup = Object.create(null);
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private eventNotificationService: EventNotificationService) {

  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/home').then(()=> {});
    } else {
      this.router.navigateByUrl('/reset-password').then(()=> {});
      this.resetPasswordForm = this.formBuilder.group({
        email: [null, Validators.compose([Validators.required])],
      });
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  onLogin(resetPasswordRequest: ResetPasswordRequest): void {
    this.showLoading = true;
    this.email = resetPasswordRequest.email
    this.subscriptions.push(
      this.authenticationService.resetPassword(resetPasswordRequest).subscribe(
        (response: any) => {
          this.router.navigateByUrl('/login').then(()=> {
            this.showLoading = false;
          });

        },
        (errorResponse: any) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }
}
