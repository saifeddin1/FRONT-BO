import { FeeStructure } from './../models/feeStructure.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeestructureService {

  constructor(private http:HttpClient) { }

  private BASE_URL: string = environment.Accounting;

  createFeestructure(Feestructure:FeeStructure){
  
    return this.http.post<any>(`${this.BASE_URL}/api/feeStructure/`,Feestructure)
  }

  getFeestructures():Observable<any>{
   return this.http.get<any>(`${this.BASE_URL}/api/feeStructure/`); 
  }

  deleteFeestructure(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/feeStructure/${id}`)
  }

  editById(id:string, element:any):Observable<any>{
   return this.http.put<any>(`${this.BASE_URL}/api/feeStructure/${id}`,element);
  }
}
