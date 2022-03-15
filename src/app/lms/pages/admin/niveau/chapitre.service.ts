import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NiveauMatiere } from './niveau.service';

export interface Chapitre {
  _id: string;
  name: string;
  description: string;
};

@Injectable({
  providedIn: 'root'
})
export class ChapitreService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/chapitre`

  /**
 * GET all
 */
  getAll(page = 0, limit = 10): Observable<Chapitre[]> {
    return this.http.get<Chapitre[]>(`${this.url}/getAll`);
  }

  /**
* GET all Queriable
*/
  search(page: number = 0, limit: number = 10, text: string = ""): Observable<{ totalCount: { count: number }, totalData: [Chapitre] }> {
    var query: string = `${this.url}/search/5?page=${page}&limit=${limit}`;
    if (text && text != "" && text != undefined && text != null) query += `&text=${text}`;
    return this.http.get<{ totalCount: { count: number }, totalData: [Chapitre] }>(query);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<Chapitre> {
    return this.http.get<Chapitre>(`${this.url}/${id}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<Chapitre>): Observable<Chapitre> {
    return this.http.post<Chapitre>(`${this.url}/`, data);
  }

  /**
   * Create
   * @param {Partial<Offre>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<Chapitre>): Observable<Chapitre> {
    return this.http.put<Chapitre>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<Chapitre> {
    return this.http.delete<Chapitre>(`${this.url}/${id}`);
  }
}
