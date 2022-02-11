import { Injectable } from '@angular/core';
import {User} from "../model/user";
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {AuthenticationService} from "./authentication.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.API_URL;
  private userSource: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient,
              private authenticationService: AuthenticationService) {

    this.userSource = new BehaviorSubject(this.authenticationService.getUserFromLocalCache());
    this.currentUser = this.userSource.asObservable();
  }

  public changeCurrentUser(user: User): void {
    this.userSource.next(user);
  }

  public getCurrentUser(): User {
    return this.userSource.value;
  }
  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/user/get-all-users`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/user/add-new-user`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/user/update-user`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.httpClient.get<CustomHttpResponse>(`${this.host}/user/reset-password/${email}`,);
  }

  public changePassword(formData: FormData): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/user/change-password`, formData);
  }

  public deleteUser(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/user/delete-user/${id}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }


  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users') as string) as User[];
    }

    return [];
  }

  public updateUserProfileImage(formData: FormData): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/user/update-profile-image`,formData);
  }


  public createUserFormData(user: User, profileImage: File | null): FormData {
    const formData = new FormData();
    formData.append('currentUserId', user.id);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('roles', JSON.stringify(user.roles));
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.nonLocked));
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return formData;
  }

  public cloneUser(user: User): User {
    const clone = new User();
    clone.id = user.id;
    clone.username = user.username;
    clone.firstName = user.firstName;
    clone.lastName = user.lastName;
    clone.email = user.email;
    clone.roles = user.roles;
    clone.active = user.active;
    clone.nonLocked = user.nonLocked;
    clone.lastLoginDate = user.lastLoginDate;
    clone.lastLoginDateDisplay = user.lastLoginDateDisplay;
    clone.joinDate = user.joinDate;
    return clone;
  }

}
