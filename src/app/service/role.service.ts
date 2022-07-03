import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Role } from "../model/role";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CustomHttpResponse } from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public addRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(`${this.host}/role/add-new-role`, role);
  }

  public updateRole(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.host}/role/update-role`, role);
  }

  public getRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.host}/role/get-all-roles`);
  }

  public deleteRole(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/role/delete-role/${id}`);
  }

  public cloneRole(roleToClone: Role): Role {
    let role = new Role();
    role.id = roleToClone.id;
    role.name = roleToClone.name;
    role.description = roleToClone.description;
    role.permissions = roleToClone.permissions;
    return role;
  }
}
