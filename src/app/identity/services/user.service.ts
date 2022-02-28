import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  private BASE_URL: string = environment.IdentityApi;

  showNotification(displayMessage: string) {
    this.snackBar.open(displayMessage, 'exit', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/`);
  }

  getOneUser(userId: String): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/${userId}`);
  }

  createUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/api/v1/users/`, user);
  }

  deleteUser(userId: string): Observable<any> {
    console.log(userId);
    return this.http.delete(`${this.BASE_URL}/api/v1/users/${userId}`);
  }

  updateUser(userId: string, item: any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/api/v1/users/${userId}`, item);
  }

  activateUser(userId: string): Observable<any> {
    console.log(userId);
    return this.http.delete(`${this.BASE_URL}/api/v1/users/activate/${userId}`);
  }

  postUser(item: any): Observable<any> {
    
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(item);
    
    console.log("iteeeeeem",item)
    return this.http.post<any>(`${this.BASE_URL}/api/v1/users/ `, item,{'headers':headers});
  }

  getStudetNiv():Observable<any>{

    return this.http.get<any>('http://localhost:5000/api/niveau/getAllForUsers');
  }
}
