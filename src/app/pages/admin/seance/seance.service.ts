import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationArgs } from 'src/app/services/pagination.service';
import { environment } from 'src/environments/environment';

export interface Seance {
  _id: string;
  name: string;
  userId: string;
  description: string;
  url: string;
  urlInstructor: string;
  urlAuthInstructor: string;
  startDate: [string];
  endDate: [string];
  niveauId: string;
  niveaux: any[];
};

@Injectable({
  providedIn: 'root'
})
export class SeanceService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/seance`

  /**
 * GET all
 */
  getAll(query: PaginationArgs): Observable<Seance[]> {
    const qs = query.getQueryUrl()
    return this.http.get<Seance[]>(`${this.url}?${qs}`);
  }

  /**
 * GET all For Student
 */
  getAllByNivMat(viewDate: string, viewType: string): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.url}/getAllByNivMat/${viewDate}?viewType=${viewType}`);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<Seance> {
    return this.http.get<Seance>(`${this.url}/findById/${id}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<Seance>): Observable<Seance> {
    return this.http.post<Seance>(`${this.url}/`, data);
  }

  /**
   * Create
   * @param {Partial<Seance>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<Seance>): Observable<Seance> {
    return this.http.put<Seance>(`${this.url}/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<Seance> {
    return this.http.delete<Seance>(`${this.url}/${id}`);
  }

}
