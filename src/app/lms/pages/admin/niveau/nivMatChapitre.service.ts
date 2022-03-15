import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Matiere } from '../matiere/matiere.service';
import { Chapitre } from './chapitre.service';
import { Niveau, NiveauMatiere } from './niveau.service';

export interface NivMatChapitre {
  _id?: string;
  nivMatId: string;
  chapitreId: string;
  order: number;
  locked: boolean;
  enabled: boolean;
};

export interface GetAllResult {
  _id: string;
  nivMatChaps: {
    _id: string;
    order: number;
    locked: boolean;
    enabled: boolean;
    nivMatId: string;
    __v: number;
    chapitreId: string;
    name: string;
    description: string;
  }[];
  nivMat: {
    _id: string;
    order: number;
    empty: boolean;
    enabled: boolean;
    matiere: Matiere;
    niveau: Niveau;
    __v: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NivMatChapitreService {

  constructor(private http: HttpClient) { }
  url = `${environment.LmsApiUrl}/api/nivMatChap`

  /**
 * GET all
 */
  getAll(nivId: string, nivMatId: string): Observable<GetAllResult> {
    return this.http.get<GetAllResult>(`${this.url}/getAll/${nivId}/${nivMatId}`);
  }

  /**
 * GET all
 */
  getChapitresByNivMatId(niveauId: string, nivMatId: string): Observable<NiveauMatiere[]> {
    return this.http.get<NiveauMatiere[]>(`${this.url}/getAllByNivMatId/${niveauId}/${nivMatId}`);
  }
  /**
 * GET by Id
 * @param {string} id    id
 */
  findById(id): Observable<NivMatChapitre> {
    return this.http.get<NivMatChapitre>(`${this.url}/${id}`);
  }

  /**
 * GET by Id
 * @param {string} id    id
 */
  getAllByNivMatId(id): Observable<NivMatChapitre[]> {
    return this.http.get<NivMatChapitre[]>(`${this.url}/ByNivMatId/${id}`);
  }

  /**
 * Search by Name or description
 * @param {string} query    query
 */
  search(query: string): Observable<NivMatChapitre[]> {
    return this.http.get<NivMatChapitre[]>(`${this.url}/search/${query}`);
  }

  /**
   * Create
   * @param {any}    data data to be created
  */
  create(data: Partial<NivMatChapitre>): Observable<NivMatChapitre> {
    return this.http.post<NivMatChapitre>(`${this.url}/`, data);
  }


  /**
   * Create
   * @param {any}    data data to be created
  */
  createWithChapitre(data: Partial<NivMatChapitre>): Observable<NivMatChapitre> {
    return this.http.post<NivMatChapitre>(`${this.url}/createWithChapitre`, data);
  }

  /**
 * Edit Chapitres Orders
 * @param {Partial<any>}    data to be updated
 * @param {string} id    id of the teacher
*/
  editOrders(data: { data: { _id: string, order: number }[] }) {
    return this.http.put(`${this.url}/editOrders/5`, data);
  }

  editById(id: string, data: Partial<NivMatChapitre>): Observable<NivMatChapitre> {
    return this.http.put<NivMatChapitre>(`${this.url}/${id}`, data);
  }


  editByIdwithChapitre(id: string, data: Partial<NivMatChapitre>): Observable<NivMatChapitre> {
    return this.http.put<NivMatChapitre>(`${this.url}/editwithChapitre/${id}`, data);
  }

  /**
   * Delete
   * @param {string} id    id
  */
  delete(id: string): Observable<NivMatChapitre> {
    return this.http.delete<NivMatChapitre>(`${this.url}/${id}`);
  }
}
