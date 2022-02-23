import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Niveau } from '../../niveau/niveau.service';

export interface InstructorNiv {
  _id: string;
  userId: string;
  niveauId: string | Niveau;
};

@Injectable({
  providedIn: 'root'
})
export class InstructorNivService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/instructorNiv`

  /**
 * GET all
 */
  getAll(): Observable<InstructorNiv[]> {
    return this.http.get<InstructorNiv[]>(this.url);
  }

  /**
 * GET by userId
 * @param {string} userId    userId
 */
  findByUserId(userId): Observable<InstructorNiv[]> {
    return this.http.get<InstructorNiv[]>(`${this.url}/byUserId/${userId}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<InstructorNiv>): Observable<InstructorNiv> {
    return this.http.post<InstructorNiv>(`${this.url}/`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<InstructorNiv> {
    return this.http.delete<InstructorNiv>(`${this.url}/${id}`);
  }
}
