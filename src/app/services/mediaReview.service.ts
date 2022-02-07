import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MediaReview {
  _id?: string;
  mediaAssignId: string;
  userId?: string;
  rate: number;
  comment?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaReviewService {
  constructor(private http: HttpClient) { }
  prefix: string = "/api/mediaReview"

  /**
  * Find By MediaReviewId And User Id
  */
  findByMediaReviewId(assignMediaId: string): Observable<MediaReview> {
    return this.http.get<MediaReview>(`${environment.apiUrl}${this.prefix}/${assignMediaId}`);
  }

  /**
  * Find By MediaReviewId And User Id
  */
  getAssignMediaRating(assignMediaId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${this.prefix}/getAssignMediaRating/${assignMediaId}`);
  }

  /**
  * Create
  */
  create(body: MediaReview): Observable<MediaReview> {
    return this.http.post<MediaReview>(`${environment.apiUrl}${this.prefix}`, body);
  }

  /**
 * DELETE By Id
 * @param {string} id id
 */
  deleteById(id: string): Observable<MediaReview> {
    return this.http.delete<MediaReview>(`${environment.apiUrl}${this.prefix}/${id}`);
  }
}
