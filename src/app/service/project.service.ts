import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {User} from "../model/user";
import {EntityService} from "./entity.service";
import {CustomHttpResponse} from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements EntityService<Project>{

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.host}/projects/`);
  }

  public getById(id: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.host}/projects/${id}`);
  }

  public getAvailableProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.host}/projects/available`);
  }

  public add(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`${this.host}/projects/`, project);
  }

  public update(project: Project): Observable<Project> {
    return this.httpClient.put<Project>(`${this.host}/projects/`, project);
  }

  public delete(id: String): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/projects/${id}`);
  }

}
