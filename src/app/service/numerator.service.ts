import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NumeratorResponse} from "../model/numerator-response";

@Injectable({
  providedIn: 'root'
})
export class NumeratorService {
  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }
  public getNumber(order: string, type: string): Observable<NumeratorResponse> {
    return this.httpClient.get<NumeratorResponse>(`${this.host}/v1/numerators/`, {params: {order: order, type: type}});

  }

}
