import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Media {
  _id: string;
  name: string;
  img: string;
  type: string;
};

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }
  url = `${environment.apiUrl}/api/media`

  /**
 * GET all
 */
  getAll(): Observable<Media[]> {
    return this.http.get<Media[]>(this.url);
  }

  /**
 * GET all Queriable
 */
  search(page: number = 0, limit: number = 10, text: string = ""): Observable<{ totalCount: { count: number }, totalData: [Media] }> {
    var query: string = `${this.url}/search/5?page=${page}&limit=${limit}`;
    if (text && text != "" && text != undefined && text != null) query += `&text=${text}`;
    return this.http.get<{ totalCount: { count: number }, totalData: [Media] }>(query);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<Media> {
    return this.http.get<Media>(`${this.url}/${id}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<Media>): Observable<Media> {
    return this.http.post<Media>(`${this.url}/`, data);
  }

  /**
   * Create
   * @param {Partial<Media>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<Media>): Observable<Media> {
    return this.http.put<Media>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<Media> {
    return this.http.delete<Media>(`${this.url}/${id}`);
  }

}
