import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../service/authentication.service";
import {EventNotificationService} from "../service/event-notification.service";
import {ScreenService} from "../service/screen.service";


@Injectable({
  providedIn: 'root'
})
export class ScreenGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private eventNotificationService: EventNotificationService,
              private screenService: ScreenService,
              private router: Router) {

  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.canActivateScreen(route.data['screen']);
  }

  private async canActivateScreen(screen: string): Promise<boolean> {
    let canActivate: boolean | undefined = false;
    await this.screenService.hasScreenAccess(screen).toPromise().then(value => canActivate = value);
    if (canActivate)
      return true;
    else
      this.router.navigateByUrl('/home').then(() => {
        this.eventNotificationService.showErrorNotification("ERRRRORR", "NO PERMISSIONS");
      })
    return false;
  }

}
