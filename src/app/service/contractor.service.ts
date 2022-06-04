import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contractor} from "../model/contractor";

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getContractors(): Observable<Contractor[]> {
    return this.httpClient.get<Contractor[]>(`${this.host}/contractors/get-all`);
  }
}
