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
  private currentUserSource: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private editedUserSource: BehaviorSubject<User>;
  public editedUser: Observable<User>;

  constructor(private httpClient: HttpClient,
              private authenticationService: AuthenticationService) {

    this.currentUserSource = new BehaviorSubject(this.authenticationService.getUserFromLocalCache());
    this.currentUser = this.currentUserSource.asObservable();

    this.editedUserSource = new BehaviorSubject(new User());
    this.editedUser = this.editedUserSource.asObservable();
  }

  public changeCurrentUser(user: User): void {
    this.currentUserSource.next(user);
    this.authenticationService.addUserToLocalCache(user);
  }

  public getCurrentUser(): User {
    return this.currentUserSource.value;
  }

  public changeEditedUser(user: User): void {
    this.editedUserSource.next(user);
  }

  public getEditedUser(): User {
    return this.editedUserSource.value;
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

  public getUserById(id: String): Observable<User> {
    return this.httpClient.get<User>(`${this.host}/user/get-by-id/${id}`);
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

  public deleteProfileImage(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${this.host}/user/delete-profile-image/${id}`);
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


  public createUserFormData(user: User, profileImage: File | string | null): FormData {
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
