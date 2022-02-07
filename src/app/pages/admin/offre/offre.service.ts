import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Offre {
  _id: string;
  name: string;
  description: string;
  img: string;
  color: string;
  type: string;
  nbrMois: number;
  prix: number;
  pourcentageRemise: number;
  withVideo: boolean;
  withPDFCourses: boolean;
  withLive: boolean;
  withRecord: boolean
  options: string[];
};

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  constructor(private http: HttpClient) { }
  url = `${environment.apiUrl}/api/offre`

  /**
 * GET all
 */
  getAll(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.url);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<Offre> {
    return this.http.get<Offre>(`${this.url}/${id}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<Offre>): Observable<Offre> {
    return this.http.post<Offre>(`${this.url}/`, data);
  }

  /**
   * Create
   * @param {Partial<Offre>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<Offre>): Observable<Offre> {
    return this.http.put<Offre>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<Offre> {
    return this.http.delete<Offre>(`${this.url}/${id}`);
  }

}
