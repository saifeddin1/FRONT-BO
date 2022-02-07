import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Matiere {
  _id: string;
  name: string;
  img: string;
  description: string;
  checked: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class MatiereService {

  constructor(private http: HttpClient) { }
  url = `${environment.apiUrl}/api/matiere`

  getAll(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.url);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<Matiere> {
    return this.http.get<Matiere>(`${this.url}/${id}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<Matiere>): Observable<Matiere> {
    return this.http.post<Matiere>(`${this.url}/`, data);
  }

  /**
   * Create
   * @param {Partial<Offre>}    data to be updated
   * @param {string} id    id
  */
  editById(id: string, data: Partial<Matiere>): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<Matiere> {
    return this.http.delete<Matiere>(`${this.url}/${id}`);
  }
}
