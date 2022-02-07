import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Niveau, NiveauMatiere } from '../../niveau/niveau.service';

export interface InstructorNivMat {
  _id: string;
  userId: string;
  niveauId: string | Niveau;
  nivMatId: string | NiveauMatiere;
};

@Injectable({
  providedIn: 'root'
})
export class InstructorNivMatService {
  constructor(private http: HttpClient) { }
  url = `${environment.apiUrl}/api/instructorNivMat`

  /**
 * GET all
 */
  getAll(): Observable<InstructorNivMat[]> {
    return this.http.get<InstructorNivMat[]>(this.url);
  }

  /**
 * GET by userId
 * @param {string} userId    userId
 */
  byUserIdNivId(userId: string, nivId: string): Observable<InstructorNivMat[]> {
    return this.http.get<InstructorNivMat[]>(`${this.url}/byUserIdNivId/${userId}/${nivId}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<InstructorNivMat>): Observable<InstructorNivMat> {
    return this.http.post<InstructorNivMat>(`${this.url}/`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<InstructorNivMat> {
    return this.http.delete<InstructorNivMat>(`${this.url}/${id}`);
  }
}
