import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetpwdService {

  constructor(private http: HttpClient) { }
  private BASE_URL: string = environment.IdentityApi;

  sendEmail(email:object){
  const headers = { 'content-type': 'application/json'}  
  return this.http.post<any>(`${this.BASE_URL}/api/v1/auth/forgetpassword/`,email,{'headers':headers})
  }
  verifycode(code:object,email:string){
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(`${this.BASE_URL}/api/v1/auth/forgetpass-verify/${email}`,code,{'headers':headers})
  }
  resetPassword(newpass:object,email:string){
    const headers = { 'content-type': 'application/json'}  
    return this.http.post<any>(`${this.BASE_URL}/api/v1/auth/resetpassword/${email}`,newpass,{'headers':headers})

  }
}
