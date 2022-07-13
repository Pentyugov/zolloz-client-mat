import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { Task } from "../model/task";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {CardHistory} from "../model/card-history";
import {EntityService} from "./entity.service";

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

  public startTask(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.get<CustomHttpResponse>(`${this.host}/tasks/start-task/${id}`);
  }

  public cancelTask(id: string, comment: string): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/tasks/cancel-task/${id}`, comment);
  }

  public executeTask(id: string, comment: string | boolean): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/tasks/execute-task/${id}`, comment);
  }

  public reworkTask(id: string, comment: string | boolean): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/tasks/rework-task/${id}`, comment);
  }

  public finishTask(id: string, comment: string | boolean): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/tasks/finish-task/${id}`, comment);
  }

  public getTaskHistory(id: string): Observable<CardHistory[]> {
    return this.httpClient.get<CardHistory[]>(`${this.host}/tasks/get-history/${id}`);
  }

  cloneTask(taskToClone: Task) {
    let task = new Task();
    task.id = taskToClone.id;
    task.priority = taskToClone.priority;
    task.number = taskToClone.number;
    task.description = taskToClone.description;
    task.comment = taskToClone.comment;
    task.state = taskToClone.state;
    task.executionDatePlan = taskToClone.executionDatePlan;
    task.executionDateFact = taskToClone.executionDateFact;
    task.creator = taskToClone.creator;
    task.executor = taskToClone.executor;
    task.initiator = taskToClone.initiator;
    task.daysUntilDueDate = taskToClone.daysUntilDueDate;
    task.started = taskToClone.started;
    return task;
  }
}
