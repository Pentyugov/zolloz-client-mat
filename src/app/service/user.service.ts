import {Injectable} from '@angular/core';
import {User} from "../model/user";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {AuthenticationService} from "./authentication.service";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class UserService implements EntityService<User>{

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

  public getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/users/`);
  }

  public getById(id: String): Observable<User> {
    return this.httpClient.get<User>(`${this.host}/users/${id}`);
  }

  public getAllWithRole(role: String): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/users/role/${role}`);
  }

  public getAllWithAnyRole(roleNames: String[]): Observable<User[]> {
    let names = roleNames.join(";")
    return this.httpClient.get<User[]>(`${this.host}/users/any-role?roleNames=${names}`);
  }

  public getUsersWithoutEmployee(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/users/without-employee`)
  }

  public addUser(formData: FormData): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/users/`, formData);
  }

  public update(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.host}/users/`, user);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/users/${id}`);
  }

  public deleteProfileImage(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${this.host}/users/profile-image/${id}`);
  }

  public updateUserProfileImage(formData: FormData): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/users/profile-image`,formData);
  }

  public add(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.host}/users/add-new-user`, user);
  }

  public createUserFormData(user: User, profileImage: File | string | null): FormData {
    const formData = new FormData();
    formData.append('currentUserId', user.id);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('roles', JSON.stringify(user.roles));
    formData.append('active', JSON.stringify(user.active));
    formData.append('nonLocked', JSON.stringify(user.nonLocked));
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    return formData;
  }

  public getUserName(user: User): string {
    if (user.firstName && user.lastName)
      return user.firstName + ' ' + user.lastName;
    else return user.username;
  }

}
