import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Program } from '../models/program.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http:HttpClient) { }

  private BASE_URL: string= environment.Accounting;

  createProgram(program:Program){
  
    return this.http.post<any>(`${this.BASE_URL}/api/program/`,program)
  }

  getPrograms():Observable<any>{
   return this.http.get<any>(`${this.BASE_URL}/api/program/`); 
  }

  deleteProgram(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/program/${id}`)
  }

  editById(id:string, element:any):Observable<any>{
   return this.http.put<any>(`${this.BASE_URL}/api/program/${id}`,element);
  }
}
