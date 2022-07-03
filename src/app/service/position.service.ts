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
    return this.httpClient.get<Position[]>(`${this.host}/position/get-all-positions`);
  }

  public getById(id: string): Observable<Position> {
    return this.httpClient.get<Position>(`${this.host}/position/get-position-by-id/${id}`);
  }

  public add(position: Position): Observable<Position> {
    return this.httpClient.post<Position>(`${this.host}/position/add-new-position`, position);
  }

  public update(position: Position): Observable<Position> {
    return this.httpClient.put<Position>(`${this.host}/position/update-position`, position);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/position/delete-position/${id}`);
  }


}
