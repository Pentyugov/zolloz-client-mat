import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { Task } from "../model/task";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {CardHistory} from "../model/card-history";
import {EntityService} from "./entity.service";
import {TaskSignalProcRequest} from "../model/task-signal-proc-request";
import {ChangeKanbanRequest} from "../modules/workflow/kanban/kanban.component";

@Injectable({
  providedIn: 'root'
})
export class TaskService implements EntityService<Task>{

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/tasks`);
  }

  public getProductivityData(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/tasks/get-productivity-data`);
  }

  public getActiveForExecutor(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/tasks/get-active-for-executor`);
  }

  public getById(id: string): Observable<Task> {
    return this.httpClient.get<Task>(`${this.host}/tasks/${id}`);
  }

  public add(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${this.host}/tasks`, task);
  }

  public update(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(`${this.host}/tasks`, task);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/tasks/${id}`);
  }

  public getPriorityTaskForUser(priority: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/tasks/get-tasks-with-priority/${priority}`);
  }

  public getTasksWhereCurrentUserExecutor(priority: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/tasks/get-tasks-current-user-executor-by-priority/${priority}`);
  }

  public getTasksPageForCurrentUser(page: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/tasks/get-task-page-for-current-user?page=${page}`);
  }

  public signalTaskProc(taskSignalProcRequest: TaskSignalProcRequest): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/tasks/signal-proc/`, taskSignalProcRequest);
  }

  public changeKanbanState(request: ChangeKanbanRequest): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/tasks/kanban/`, request);
  }

  public getTaskHistory(id: string): Observable<CardHistory[]> {
    return this.httpClient.get<CardHistory[]>(`${this.host}/tasks/get-history/${id}`);
  }

}
