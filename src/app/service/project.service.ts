import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {User} from "../model/user";
import {Role} from "../model/role";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.host}/projects/get-all-projects`);
  }

  public addProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`${this.host}/projects/add-project`, project);
  }

  public updateProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(`${this.host}/projects/update-project`, project);
  }

  public getProjectById(id: String): Observable<Project> {
    return this.httpClient.get<Project>(`${this.host}/projects/get-by-id/${id}`);
  }

  public getProjectParticipants(projectId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/projects/get-participants-by-project/`);
  }
}
