import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Position} from "../model/position";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class PositionService implements EntityService<Position> {
  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Position[]> {
    return this.httpClient.get<Position[]>(`${this.host}/positions/`);
  }

  public getById(id: string): Observable<Position> {
    return this.httpClient.get<Position>(`${this.host}/positions/${id}`);
  }

  public add(position: Position): Observable<Position> {
    return this.httpClient.post<Position>(`${this.host}/positions/`, position);
  }

  public update(position: Position): Observable<Position> {
    return this.httpClient.put<Position>(`${this.host}/positions/`, position);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/positions/${id}`);
  }


}
