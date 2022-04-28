import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Matiere } from '../matiere/matiere.service';
import { Chapitre } from './chapitre.service';

// Start Niveau List Component 
export interface Niveau {
  _id: string;
  name: string;
  tag: string;
  order: number;
  isPublic: boolean;
  enabled: boolean;
  matieres: any[];
};

export interface NiveauMatiere {
  _id: string;
  matiere?: Matiere | string | any;
  niveau: Niveau | string | any;
  userId: string;
  enabled: boolean;
  locked: boolean;
  order: number;
  name?: string;
  matiereId?: string,
  chapitres?: [Chapitre]
};
// End Niveau List Component 

// Start Niveau Matiere List Component 
export interface NiveauWithMatiere {
  name: string
  description: string,
  enabled: boolean,
  nivmats: [NiveauMatiere]
}
// End Niveau Matiere List Component 

@Injectable({
  providedIn: 'root'
})
export class NiveauService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/niveau`
  subject = new Subject<any>();

  /**
 * GET all
 */
  getAll(): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(this.url);
  }
  

  /**
 * GET all
 */
  getAllForUsers(): Observable<any> {
    return this.http.get<any>(`${this.url}/getAllForUsers`);
  }

  /**
  * GET With Matieres by Id
  * @param {string} id    id
  */
  findByIdwithMatieres(id): Observable<NiveauWithMatiere> {
    return this.http.get<NiveauWithMatiere>(`${this.url}/withMatieres/${id}`);
  }

  /**
  * GET With Matieres by Id
  * @param {string} id    id
  */
  getSeeMoreByNiveauId(niveauId, nivMatId, limit): Observable<NiveauWithMatiere> {
    return this.http.get<NiveauWithMatiere>(`${this.url}/getSeeMoreByNiveauId/${niveauId}/${nivMatId}?limit=${limit}`);
  }


  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<Niveau> {
    return this.http.get<Niveau>(`${this.url}/${id}`);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  getAllMatieresById(nivId: string): Observable<NiveauMatiere[]> {
    return this.http.get<NiveauMatiere[]>(`${this.url}/getAllMatieresById/${nivId}`);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  getMatiereByNivMatId(id): Observable<NiveauMatiere> {
    return this.http.get<NiveauMatiere>(`${this.url}/getMatiereByNivMatId/${id}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<Niveau[]> {
    return this.http.get<Niveau[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  createNiveau(data: Partial<Niveau>): Observable<Niveau> {
    return this.http.post<Niveau>(`${this.url}/`, data);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  createNivMat(data: Partial<Niveau>): Observable<Niveau> {
    return this.http.post<Niveau>(`${this.url}/createNivMat`, data);
  }

  /**
   * Create
   * @param {Partial<Offre>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editById(id: string, data: Partial<Niveau>): Observable<Niveau> {
    return this.http.put<Niveau>(`${this.url}/${id}`, data);
  }

  /**
   * Create
   * @param {Partial<Nivmat>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editNivMatById(id: string, data: Partial<NiveauMatiere>): Observable<NiveauMatiere> {
    return this.http.put<NiveauMatiere>(`${this.url}/editNivMatById/${id}`, data);
  }

  /**
   * Edit Niveau Orders
   * @param {Partial<any>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editNivsOrders(data: { nivs: { _id: string, order: number }[] }): Observable<void> {
    return this.http.put<void>(`${this.url}/editNivsOrders`, data);
  }

  /**
   * Edit Niveau Matieres Orders
   * @param {Partial<any>}    data to be updated
   * @param {string} id    id of the teacher
  */
  editMatieresOrders(data: { nivMats: { _id: string, order: number }[] }): Observable<void> {
    return this.http.put<void>(`${this.url}/editMatieresOrders`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<Niveau> {
    return this.http.delete<Niveau>(`${this.url}/${id}`);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  deleteNivMat(id: string): Observable<Niveau> {
    return this.http.delete<Niveau>(`${this.url}/deleteNivMat/${id}`);
  }
}
