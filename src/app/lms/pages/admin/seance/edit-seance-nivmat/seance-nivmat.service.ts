import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Niveau, NiveauMatiere } from '../../niveau/niveau.service';

export interface SeanceNivMat {
  _id: string;
  seanceId: string;
  niveauId: string | Niveau;
  nivMatId: string | NiveauMatiere;
};

@Injectable({
  providedIn: 'root'
})
export class SeanceNivMatService {
  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/seanceNivMat`

  /**
 * GET all
 */
  getAll(): Observable<SeanceNivMat[]> {
    return this.http.get<SeanceNivMat[]>(this.url);
  }

  /**
 * GET by seanceId
 * @param {string} seanceId    seanceId
 */
  bySeanceIdNivId(seanceId: string, nivId: string): Observable<SeanceNivMat[]> {
    return this.http.get<SeanceNivMat[]>(`${this.url}/bySeanceIdNivId/${seanceId}/${nivId}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<SeanceNivMat>): Observable<SeanceNivMat> {
    return this.http.post<SeanceNivMat>(`${this.url}/`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<SeanceNivMat> {
    return this.http.delete<SeanceNivMat>(`${this.url}/${id}`);
  }
}
