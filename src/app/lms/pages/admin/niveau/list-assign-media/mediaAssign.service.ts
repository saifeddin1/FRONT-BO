import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MediaAssign {
  _id: string;
  name: string;
  assignId: string;
  mediaTypeId: string;
  videoUrl: string;
  videoEnabled: string;
  order: number;
  locked: boolean;
  enabled: boolean;
  files?: any
  // files?: MediaAssignFile
};

export interface MediaAssignFile {
  _id: string;
  mediaId: string;
  assignId: string;
  order: number;
  locked: boolean;
  enabled: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class MediaAssignService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/mediaAssign`

  /**
 * GET all
 */
  getAll(): Observable<MediaAssign[]> {
    return this.http.get<MediaAssign[]>(this.url);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<MediaAssign> {
    return this.http.get<MediaAssign>(`${this.url}/${id}`);
  }

  /**
 * GET findByAssignId mediaAssignId
 * @param {string} id    id
 */
  findByAssignId(mediaAssignId: string, mediaTypeId: string, populateFiles: any = false): Observable<MediaAssign[]> {
    var query: string = `${this.url}/findByAssignId/${mediaAssignId}/${mediaTypeId}`;
    if (populateFiles) query += `?populateFiles=${populateFiles}`;
    console.log("query : ", query);
    return this.http.get<MediaAssign[]>(query);
  }

  /**
 * GET findByAssignId mediaAssignId
 * @param {string} id    id
 */
  findByAssignIdForStudent(mediaAssignId: string, mediaTypeId: string, populateFiles: any = false): Observable<MediaAssign[]> {
    var query: string = `${this.url}/findByAssignIdForStudent/${mediaAssignId}/${mediaTypeId}`;
    if (populateFiles) query += `?populateFiles=${populateFiles}`;
    console.log("query : ", query);
    return this.http.get<MediaAssign[]>(query);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<MediaAssign[]> {
    return this.http.get<MediaAssign[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<MediaAssign>): Observable<MediaAssign> {
    return this.http.post<MediaAssign>(`${this.url}/`, data);
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
   * @param {Partial<MediaAssign>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<MediaAssign>): Observable<MediaAssign> {
    return this.http.put<MediaAssign>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<MediaAssign> {
    return this.http.delete<MediaAssign>(`${this.url}/${id}`);
  }

}
