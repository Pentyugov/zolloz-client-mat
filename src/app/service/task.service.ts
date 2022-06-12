import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { Task } from "../model/task";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {CardHistory} from "../model/card-history";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/task/get-all`);
  }

  public addTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${this.host}/task/add-new-task`, task);
  }

  public updateTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(`${this.host}/task/update-task`, task);
  }

  public getPriorityTaskForUser(priority: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/task/get-tasks-with-priority/${priority}`);
  }

  public getTasksWhereCurrentUserExecutor(priority: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/task/get-tasks-current-user-executor-by-priority/${priority}`);
  }

  public getTasksPageForCurrentUser(page: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${this.host}/task/get-task-page-for-current-user?page=${page}`);
  }

  public deleteTask(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/task/delete-task/${id}`);
  }

  public startTask(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.get<CustomHttpResponse>(`${this.host}/task/start-task/${id}`);
  }

  public cancelTask(id: string, comment: string): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/task/cancel-task/${id}`, comment);
  }

  public executeTask(id: string, comment: string | boolean): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/task/execute-task/${id}`, comment);
  }

  public reworkTask(id: string, comment: string | boolean): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/task/rework-task/${id}`, comment);
  }

  public finishTask(id: string, comment: string | boolean): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/task/finish-task/${id}`, comment);
  }

  public getTaskHistory(id: string): Observable<CardHistory[]> {
    return this.httpClient.get<CardHistory[]>(`${this.host}/task/get-history/${id}`);
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
