import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contractor} from "../model/contractor";
import {CustomHttpResponse} from "../model/custom-http-response";
import {EntityService} from "./entity.service";

@Injectable({
  providedIn: 'root'
})
export class ContractorService implements EntityService<Contractor> {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Contractor[]> {
    return this.httpClient.get<Contractor[]>(`${this.host}/contractors`);
  }

  getById(id: String): Observable<Contractor> {
    return this.httpClient.get<Contractor>(`${this.host}/contractors/${id}`);
  }

  add(entity: Contractor): Observable<Contractor> {
    return this.httpClient.post<Contractor>(`${this.host}/contractors/`, entity);
  }

  update(entity: Contractor): Observable<Contractor> {
    return this.httpClient.put<Contractor>(`${this.host}/contractors/`, entity);
  }

  delete(id: String): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/contractors/${id}`);
  }

}
