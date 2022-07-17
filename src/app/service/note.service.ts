import { Injectable } from '@angular/core';
import {EntityService} from "./entity.service";
import {Position} from "../model/position";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Note} from "../model/note";

@Injectable({
  providedIn: 'root'
})
export class NoteService implements EntityService<Note> {
  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${this.host}/notes/`);
  }

  public getById(id: string): Observable<Note> {
    return this.httpClient.get<Note>(`${this.host}/notes/${id}`);
  }

  public add(note: Note): Observable<Note> {
    return this.httpClient.post<Note>(`${this.host}/notes`, note);
  }

  public addNewNote(note: Note): Observable<CustomHttpResponse> {
    return this.httpClient.post<CustomHttpResponse>(`${this.host}/notes`, note);
  }

  public update(note: Note): Observable<Note> {
    return this.httpClient.put<Note>(`${this.host}/notes`, note);
  }

  public updateNote(note: Note): Observable<CustomHttpResponse> {
    return this.httpClient.put<CustomHttpResponse>(`${this.host}/notes`, note);
  }

  public delete(id: string): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/notes/${id}`);
  }


}
