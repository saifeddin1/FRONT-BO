import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MediaType {
  _id: string;
  name: string;
  nameSingulier: string;
  category: string;
  order: number;
  enabled: boolean;
};

type DocType = MediaType

@Injectable({
  providedIn: 'root'
})
export class MediaTypeService {

  constructor(private http: HttpClient) { }
  url = `${environment.apiUrl}/api/mediaType`

  /**
 * GET all
 */
  getAll(): Observable<DocType[]> {
    return this.http.get<DocType[]>(this.url);
  }

  /**
 * Get Public MediaTypes
 */
  getPublicMediaTypes(): Observable<DocType[]> {
    return this.http.get<DocType[]>(`${this.url}/getPublicMediaTypes`);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<DocType> {
    return this.http.get<DocType>(`${this.url}/${id}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<DocType[]> {
    return this.http.get<DocType[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<DocType>): Observable<DocType> {
    return this.http.post<DocType>(`${this.url}/`, data);
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
   * @param {Partial<DocType>}    data to be updated
   * @param {string} id    id of the media Type
  */
  editById(id: string, data: Partial<DocType>): Observable<DocType> {
    return this.http.put<DocType>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<DocType> {
    return this.http.delete<DocType>(`${this.url}/${id}`);
  }

}
