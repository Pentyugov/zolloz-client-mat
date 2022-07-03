import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Position} from "../model/position";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public addPosition(position: Position): Observable<Position> {
    return this.httpClient.post<Position>(`${this.host}/position/add-new-position`, position);
  }

  public updatePosition(position: Position): Observable<Position> {
    return this.httpClient.put<Position>(`${this.host}/position/update-position`, position);
  }

  public getPositions(): Observable<Position[]> {
    return this.httpClient.get<Position[]>(`${this.host}/position/get-all-positions`);
  }

  public deletePosition(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/position/delete-position/${id}`);
  }


}
