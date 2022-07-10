import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {LoginRequest} from "../model/login-request";
import {SignUpRequest} from "../model/sign-up-request";
import {JwtHelperService} from "@auth0/angular-jwt";
import {CustomHttpResponse} from "../model/custom-http-response";
import {SystemRoleName} from "../enum/system-role-name.enum";
import {Router} from "@angular/router";
import {EventNotificationService} from "./event-notification.service";
import {ApplicationService} from "./application.service";
import {NgxPermissionsService, NgxRolesService} from "ngx-permissions";
import {ScreenService} from "./screen.service";
import {ResetPasswordRequest} from "../model/reset-password-request";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.API_URL;
  private token: string | null;
  private loggedInUsername: string | null;
  private jwtHelperService = new JwtHelperService();
  private permissions: string[] = [];

  constructor(private httpClient: HttpClient,
              private router: Router,
              private applicationService: ApplicationService,
              private eventNotificationService: EventNotificationService,
              private permissionsService: NgxPermissionsService,
              private roleService: NgxRolesService,
              private screenService: ScreenService) {
    this.token = '';
    this.loggedInUsername = '';
  }

  public login(loginRequest: LoginRequest): Observable<HttpResponse<User>> {
    return this.httpClient.post<User>(`${this.host}/auth/login`, loginRequest, {observe: 'response'});
  }

  public register(signUpRequest: SignUpRequest): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/auth/register`, signUpRequest);
  }

  public changePassword(formData: FormData): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/auth/change-password`, formData);
  }

  public resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/auth/reset-password`, resetPasswordRequest);
  }

  public logOut(showNotification: boolean = false): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.clear();
    this.applicationService.resetUserSettings();
    this.router.navigateByUrl('/login').then(() => {
      if (showNotification) {
        this.eventNotificationService.showInfoNotification('Info', 'You have been successfully logged out');
      }
    });
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', this.token);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.updateRoles();
    this.updatePermissions();
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user') as string)
  }

  public getTokenFromLocalCache(): string {
    return this.token as string;
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '' &&
      (this.jwtHelperService.decodeToken(this.token).sub != null || '') &&
      !this.jwtHelperService.isTokenExpired(this.token)) {

      this.loggedInUsername = this.jwtHelperService.decodeToken(this.token).sub;
      return true;

    } else {
      // this.logOut();
      return false;
    }
  }

  public isCurrentUserInRole(roleName: string): boolean {
    let user: User = this.getUserFromLocalCache();
    for (let role of user.roles) {
      if (role.name.toLowerCase() === roleName.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  public isCurrentUserAdmin(): boolean {
    let user: User = this.getUserFromLocalCache();
    for (let role of user.roles) {
      if (role.name.toUpperCase() === SystemRoleName.ADMIN) {
        return true;
      }
    }

    return false;
  }

  public updateRoles(): void {
    this.getUserFromLocalCache().roles.forEach(role =>
      this.roleService.addRole(role.name, () => {
        return true;
      }));
  }

  public updatePermissions():void {
    this.getUserFromLocalCache()
      .roles.forEach(role =>
        role.permissions?.forEach(permission => {
          this.permissions.push(permission.name);
          this.permissionsService.addPermission(permission.name)
        }));
  }



  public canActivateScreen(screen: string): boolean {
    return this.hasAccessToScreen(screen)
  }

  public hasAccessToScreen(screen: string): boolean {
    this.screenService.hasScreenAccess(screen).subscribe((response: boolean) => {
      console.log(response);
    })
    return false;
  }

}
