import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from 'karma-jasmine-html-reporter';
import { Observable } from 'rxjs';
import { User } from 'src/app/eidentity/models/user.model';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getToken = () => localStorage.getItem('token');

  decodeToken = (token: string): User | any =>
    token ? jwt_decode(token) : null;

  getDecodedToken = (): User | any => this.decodeToken(this.getToken());
  // save username and password into local storage, so they can stay logged in
  user: User | any = this.getDecodedToken() || null;

  /**
   * Gets the current user stored in the service
   */
  getCurrentUser(): User {
    return this.user;
  }
  setUser(user: User): void {
    this.user = user;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  private BASE_URL: string = environment.IdentityApi;

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/`);
  }
  getDisableStudents(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/disablestudent`);
  }
  getallHr(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/allhr`);
  }

  getAllEmployees(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/allEmployees`);
  }

  getalldisabledHr(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/alldisabledhr`);
  }
  getallInstructor(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/allinstructor`);
  }
  getalldisabledInstructor(): Observable<any> {
    return this.http.get<any>(
      `${this.BASE_URL}/api/v1/users/alldisabledinstructor`
    );
  }
  getallorganisatiowners(): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/allorganisationowners`);
  }

  getOneUser(userId: String): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/api/v1/users/${userId}`);
  }

  createUser(user: any): Observable<any> {
    const body = JSON.stringify(user);

    return this.http.post<any>(`${this.BASE_URL}/api/v1/users/`, user);
  }

  deleteUser(userId: string): Observable<any> {
    console.log(userId);
    return this.http.delete(`${this.BASE_URL}/api/v1/users/${userId}`);
  }

  updateUser(userId: string, item: any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/api/v1/users/${userId}`, item);
  }
  restore(userId: string): Observable<any> {
    console.log('userId ', userId);
    return this.http.put<any>(
      `${this.BASE_URL}/api/v1/users/restore/${userId}`,
      {}
    );
  }

  activateUser(userId: string): Observable<any> {
    console.log(userId);
    return this.http.delete(`${this.BASE_URL}/api/v1/users/activate/${userId}`);
  }

  getStudetNiv(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/niveau/');
  }
}
