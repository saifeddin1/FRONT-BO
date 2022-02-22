import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Niveau } from '../../niveau/niveau.service';

export interface SeanceNiv {
  _id: string;
  seanceId: string;
  niveauId: string | Niveau;
};

@Injectable({
  providedIn: 'root'
})
export class SeanceNivService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/seanceNiv`

  /**
 * GET all
 */
  getAll(): Observable<SeanceNiv[]> {
    return this.http.get<SeanceNiv[]>(this.url);
  }

  /**
 * GET by seanceId
 * @param {string} seanceId    seanceId
 */
  findBySeanceId(seanceId): Observable<SeanceNiv[]> {
    return this.http.get<SeanceNiv[]>(`${this.url}/bySeanceId/${seanceId}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<SeanceNiv>): Observable<SeanceNiv> {
    return this.http.post<SeanceNiv>(`${this.url}/`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<SeanceNiv> {
    return this.http.delete<SeanceNiv>(`${this.url}/${id}`);
  }
}
