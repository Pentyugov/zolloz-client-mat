import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../model/project";
import {User} from "../model/user";

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

  public getProjectParticipants(projectId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.host}/projects/get-participants-by-project/`);
  }
}
