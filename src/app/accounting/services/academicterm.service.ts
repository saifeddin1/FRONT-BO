import { HttpClient } from '@angular/common/http';
import {Academicterm} from './../models/academicterm.model'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcademictermService {

  constructor(private http:HttpClient) { }

  private BASE_URL: string= environment.Accounting;

  createAcademicterm(academicterm:any, id: string){
  
    return this.http.post<any>(`${this.BASE_URL}/api/academicterm/${id}`,academicterm)
  }

  getAcademicterms():Observable<any>{
   return this.http.get<any>(`${this.BASE_URL}/api/academicterm/`); 
  }
  getDisabledAcademicterms():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/academicterm/disabledacademicterm`); 
   }

  getOneAcademicterm(id:string):Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/academicterm/${id}`); 
   }

  deleteAcademicterm(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/academicterm/${id}`)
  }

  editById(id:string, element:any):Observable<any>{
   return this.http.put<any>(`${this.BASE_URL}/api/academicterm/${id}`,element);
  }
  restore(id:string):Observable<any>{
    return this.http.put<any>(`${this.BASE_URL}/api/academicterm/restore/${id}`,{});
   }
}
