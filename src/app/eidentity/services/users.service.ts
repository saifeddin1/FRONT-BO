import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from 'karma-jasmine-html-reporter';
import { Observable } from 'rxjs';
import { User } from 'src/app/eidentity/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
 
  constructor(private http: HttpClient) { }

  private BASE_URL: string = environment.IdentityApi;

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/`);
  }

  getOneUser(userId: String): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/${userId}`);
  }

  createUser(user: any): Observable<any> {
    const body = JSON.stringify(user)
    

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

  

  getStudetNiv():Observable<any>{

    return this.http.get<any>('http://localhost:5000/api/niveau/getAllForUsers');
  }
}
