import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EntityService} from "./entity.service";
import {ZollozCalendarEvent} from "../model/event";
import {CustomHttpResponse} from "../model/custom-http-response";

@Injectable({
  providedIn: 'root'
})
export class CalendarService implements EntityService<ZollozCalendarEvent>{

  private host = environment.API_URL;

  constructor(private httpClient: HttpClient) {
  }

  public getAll(): Observable<ZollozCalendarEvent[]> {
    return this.httpClient.get<ZollozCalendarEvent[]>(`${this.host}/calendar-events/`);
  }

  public getById(id: String): Observable<ZollozCalendarEvent> {
    return this.httpClient.get<ZollozCalendarEvent>(`${this.host}/calendar-events/${id}`);
  }

  public add(calendarEvent: ZollozCalendarEvent): Observable<ZollozCalendarEvent> {
    return this.httpClient.post<ZollozCalendarEvent>(`${this.host}/calendar-events/`, calendarEvent);
  }

  public update(calendarEvent: ZollozCalendarEvent): Observable<ZollozCalendarEvent> {
    return this.httpClient.put<ZollozCalendarEvent>(`${this.host}/calendar-events/`, calendarEvent);
  }

  public delete(id: String): Observable<CustomHttpResponse> {
    return this.httpClient.delete<CustomHttpResponse>(`${this.host}/calendar-events/${id}`);
  }

}
