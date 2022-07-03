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
    return this.httpClient.get<Project[]>(`${this.host}/projects/get-all-projects`);
  }

  public getById(id: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.host}/projects/get-by-id/${id}`);
  }

  public getAvailableProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.host}/projects/get-available`);
  }

  public add(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`${this.host}/projects/add-project`, project);
  }

  public update(project: Project): Observable<Project> {
    return this.httpClient.put<Project>(`${this.host}/projects/update-project`, project);
  }

  public delete(id: String): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/projects/delete-project/${id}`);
  }

  public getProjectParticipants(projectId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/projects/get-participants-by-project/`);
  }
}
