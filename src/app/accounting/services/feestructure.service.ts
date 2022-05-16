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

  createFeestructure(Feestructure:Object){
  
    return this.http.post<any>(`${this.BASE_URL}/api/feeStructure/`,Feestructure)
  }

  getFeestructures():Observable<any>{
   return this.http.get<any>(`${this.BASE_URL}/api/feeStructure/`); 
  }

  getDisabledFeestructures():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/feeStructure/disabledfeeStruct`); 
   }
  

  getFeestructureswithname(term ?: string):Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/feeStructure/byname?filtre=${term}`); 
   }

  deleteFeestructure(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/feeStructure/${id}`)
  }
  getOneFeestructure(id:string):Observable<any>{
    return this.http.get(`${this.BASE_URL}/api/feeStructure/${id}`)
  }

  editById(id:string, element:any):Observable<any>{
   return this.http.put<any>(`${this.BASE_URL}/api/feeStructure/${id}`,element);
  }
  restore(id:string ):Observable<any>{
    return this.http.put<any>(`${this.BASE_URL}/api/feeStructure/restore/${id}`,{});
   }
}
