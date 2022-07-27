import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Employee} from "../model/employee";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements EntityService<Employee>{

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.host}/employees/`);
  }

  public getById(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.host}/employees/${id}`);
  }

  public add(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.host}/employees/`, employee);
  }

  public update(employee: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(`${this.host}/employees/`, employee);
  }

  public updateAllEmployees(employees: Employee[]): Observable<Employee[]> {
    return this.httpClient.put<Employee[]>(`${this.host}/employees/all`, employees);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/employees/${id}`);
  }

  public getEmployeesByDepartments(departmentId: string): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.host}/employees/department/${departmentId}`);
  }

}
