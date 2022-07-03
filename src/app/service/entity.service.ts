import {Observable} from "rxjs";
import {CustomHttpResponse} from "../model/custom-http-response";
import {Entity} from "../model/entity";

export interface EntityService<T extends Entity> {
  getAll(): Observable<T[]>;
  getById(id: String): Observable<T>;
  add(entity: Entity): Observable<T>;
  update(entity: Entity): Observable<T>;
  delete(id: String): Observable<CustomHttpResponse>;
}
