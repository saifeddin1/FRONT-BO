import { Academicyear } from './../models/acadmicyear.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicyearService {

  constructor(private http:HttpClient) { }

  private BASE_URL: string= environment.Accounting;

  createAcademicyear(academicyear:Academicyear){
  
    return this.http.post<any>(`${this.BASE_URL}/api/academicyear/`,academicyear)
  }

  getAcademicyears():Observable<any>{
   return this.http.get<any>(`${this.BASE_URL}/api/academicyear/`); 
  }

  deleteAcademicyear(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/academicyear/${id}`)
  }

  getOneAcademicyearterms(id:string):Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/academicyear/terms/${id}`)
  }

  editById(id:string, element:any):Observable<any>{
   return this.http.put<any>(`${this.BASE_URL}/api/academicyear/${id}`,element);
  }
}
