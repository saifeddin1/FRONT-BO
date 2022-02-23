import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Media } from '../../media/media.service';

export interface MediaAssignFile {
  _id: string;
  mediaId: string | Media | any;
  mediaAssignId: string;
  order: number;
  locked: boolean;
  enabled: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class MediaAssignFileService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/mediaAssignFile`

  /**
 * GET all
 */
  getAll(): Observable<MediaAssignFile[]> {
    return this.http.get<MediaAssignFile[]>(this.url);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<MediaAssignFile> {
    return this.http.get<MediaAssignFile>(`${this.url}/${id}`);
  }

  /**
 * GET get assign media files mediaAssignId
 * @param {string} id    id
 */
  getAssignMediaFiles(mediaAssignId: string): Observable<MediaAssignFile[]> {
    return this.http.get<MediaAssignFile[]>(`${this.url}/getAssignMediaFiles/${mediaAssignId}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<MediaAssignFile[]> {
    return this.http.get<MediaAssignFile[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<MediaAssignFile>): Observable<MediaAssignFile> {
    return this.http.post<MediaAssignFile>(`${this.url}/`, data);
  }

  /**
* Edit Orders
* @param {Partial<any>}    data to be updated
* @param {string} id    id
*/
  editOrders(data: { data: { _id: string, order: number }[] }): Observable<void> {
    return this.http.put<void>(`${this.url}/editOrders`, data);
  }

  /**
   * Create
   * @param {Partial<MediaAssignFile>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<MediaAssignFile>): Observable<MediaAssignFile> {
    return this.http.put<MediaAssignFile>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<MediaAssignFile> {
    return this.http.delete<MediaAssignFile>(`${this.url}/${id}`);
  }

}
