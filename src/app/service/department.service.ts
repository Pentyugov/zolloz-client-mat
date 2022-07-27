import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Department} from "../model/department";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService implements EntityService<Department>{

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(`${this.host}/departments/`);
  }

  public getById(id: string): Observable<Department> {
    return this.httpClient.get<Department>(`${this.host}/departments/${id}`);
  }

  public add(department: Department): Observable<Department> {
    return this.httpClient.post<Department>(`${this.host}/departments/`, department);
  }

  public update(department: Department): Observable<Department> {
    return this.httpClient.put<Department>(`${this.host}/departments/`, department);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/departments/${id}`);
  }

  public getPossibleParentDepartments(id: string): Observable<Department[]> {
    return this.httpClient.get<Department[]>(`${this.host}/departments/${id}/possible-parent/`);
  }

  public addDepartmentsToLocalCache(departments: Department[]): void {
    localStorage.setItem('departments', JSON.stringify(departments));
  }

  public getDepartmentsFromLocalCache(): Department[] {
    if (localStorage.getItem('departments')) {
      return JSON.parse(localStorage.getItem('departments') as string) as Department[];
    }

    return [];
  }

  public cloneDepartment(departmentToClone: Department): Department {
    const department = new Department();
    department.id = departmentToClone.id;
    department.name = departmentToClone.name;
    department.code = departmentToClone.code;
    department.parentDepartment = departmentToClone.parentDepartment;
    department.head = departmentToClone.head;
    return department;
  }
}
