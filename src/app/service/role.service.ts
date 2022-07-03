import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Role } from "../model/role";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CustomHttpResponse } from "../model/custom-http-response";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class RoleService implements EntityService<Role>{

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.host}/role/get-all-roles`);
  }

  public getById(id: string): Observable<Role> {
    return this.httpClient.get<Role>(`${this.host}/role/get-by-id/${id}`);
  }

  public add(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(`${this.host}/role/add-new-role`, role);
  }

  public update(role: Role): Observable<Role> {
    return this.httpClient.put<Role>(`${this.host}/role/update-role`, role);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/role/delete-role/${id}`);
  }

}
