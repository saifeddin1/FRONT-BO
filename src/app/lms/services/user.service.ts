import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export const ROLES = {
  ADMIN: 'EADMIN',
  INSTRUCTOR: 'EINSTRUCTOR',
  STUDENT: 'ESTUDENT',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

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

  goToProfile(): void {
    this.router.navigate([`lms/user/${this.getCurrentUser().username}`]);
  }

  logOut(): void {
    localStorage.clear();
    this.setUser(null);
    // this.chatService.destroy();
    this.router.navigate(['about']);
  }

  /**
   * POST new user
   * @param {User} newUser the about-to-be user
   */
  postNewUser(newUser: Partial<User>): Observable<{ token: string }> {
    const {
      username,
      password,
      email,
      type,
      studentNiveauId,
      studentOffreId,
      profile,
      phone,
      permissions,
    } = newUser;
    return this.http.post<{ token: string }>(
      `${environment.IdentityApi}/api/v1/auth/register`,
      {
        username,
        password,
        email,
        type,
        studentNiveauId,
        studentOffreId,
        profile,
        phone,
        permissions,
      }
    );
  }

  /**
   * Update
   * @param {Partial<User>}    data to be updated
   * @param {string} id    id
   */
  editUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${environment.LmsApiUrl}/api/user/editUser`,
      data
    );
  }

  /**
   * Update
   * @param {Partial<User>}    data to be updated
   * @param {string} id    id
   */
  editById(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${environment.LmsApiUrl}/api/user/editById/${id}`,
      data
    );
  }

  /**
   * Get existing user by id
   * @param {String} id username of the user
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(
      environment.LmsApiUrl + '/api/user/getUserById/' + id
    );
  }

  /**
   * GET users by search query
   * @param {String} query the search query
   */
  search(query: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.LmsApiUrl}/api/user/search/${query}`
    );
  }

  /**
   * POST login user
   * @param {string} email    email of user
   * @param {string} password password of user
   */
  loginUser(
    email: string,
    password: string
  ): Observable<boolean | { token: string }> {
    return this.http.post<boolean | { token: string }>(
      `${environment.IdentityApi}/api/v1/auth/login/${email}`,
      {
        password,
      }
    );
  }

  /**
   * Updates the user object stored in the service & localStorage
   * @param {User} user the loggedIn user instance
   */
  setUser(user: User): void {
    this.user = user;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  /**
   * POST update password
   * @param {string} _id       id of user
   * @param {string} password  new password
   */
  updatePassword(_id: string, password: string): Observable<any> {
    return this.http.post(`${environment.LmsApiUrl}/api/user/updatePassword`, {
      _id,
      password,
    });
  }

  /**
   * PUT update credit (user)
   * @param {string} _id        id of user
   * @param {double} credit     amount to update credit with
   */
  updateCredit(_id: string, credit: number): Observable<any> {
    return this.http.put(environment.LmsApiUrl + '/api/user/updateCredit', {
      _id,
      credit,
    });
  }

  /**
   * DELETE drop a course (Impact Learner only)
   * @param {string} userId    id of user
   * @param {string} courseId  id of course
   */
  dropACourse(userId: string, courseId: string): Observable<any> {
    return this.http.delete(
      `${environment.LmsApiUrl}/api/user/dropCourse/${courseId}/${userId}`
    );
  }

  /**
   * DELETE user
   * @param {string} userId    id of user
   */
  deleteUser(userId: string): Observable<any> {
    console.log(userId);
    return this.http.delete(
      `${environment.LmsApiUrl}/api/user/deleteUser/${userId}`
    );
  }

  /**
   * PUT user profile
   * @param _id id of the user
   * @param profile {fullName, phone, linkedIn, facebook}
   * @return user
   */
  editProfile(profile: any): Observable<User> {
    return this.http.put<User>(
      `${environment.LmsApiUrl}/api/user/editProfile`,
      { profile }
    );
  }

  /**
   * PUT user profile
   * @param _id id of the user
   * @param profile {fullName, phone, linkedIn, facebook}
   * @return user
   */
  updateOffre(_id: string, studentOffreId: any): Observable<User> {
    return this.http.put<User>(
      `${environment.LmsApiUrl}/api/user/updateOffre`,
      {
        _id,
        studentOffreId,
      }
    );
  }

  getAllStudents(): Observable<any> {
    return this.http.get(`${environment.LmsApiUrl}/api/user/getAllStudents`);
  }

  getAllInstructors(): Observable<any> {
    return this.http.get(`${environment.LmsApiUrl}/api/user/getAllInstructors`);
  }
  getAllInstructorsNames(): Observable<any> {
    return this.http.get(
      `${environment.LmsApiUrl}/api/user/getAllInstructorsNames`
    );
  }

  addChat(userId: string, chatId: string): Observable<User> {
    return this.http.put<User>(`${environment.LmsApiUrl}/api/user/addChat`, {
      userId,
      chatId,
    });
  }

  /**
   * GET user image
   * @param {string} userId id of course
   */
  getUserImage(userId: string): Observable<any> {
    return this.http.get(
      `${environment.LmsApiUrl}/api/user/${userId}/getUserImage`
    );
  }

  /**
   * POST add profile image to user
   * @param {FormData} file the course image
   * @param {string} courseId id of course
   */
  uploadImage(file: FormData, userId: string): Observable<User> {
    return this.http.post<User>(
      `${environment.LmsApiUrl}/api/user/${userId}/uploadImage`,
      file
    );
  }

  validateEmail(email) {
    const regularExpression =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }
}
