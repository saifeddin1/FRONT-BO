import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../hr/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private BASE_URL: string = environment.HRApi;

  constructor(private http: HttpClient) {}

  updateNotification(id: string, body: Notification): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.BASE_URL}/notifications/${id}`,
      body
    );
  }
  getUnreadNotifCount(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.BASE_URL}/notifications/getUnreadNotificationsCount`
    );
  }
}
