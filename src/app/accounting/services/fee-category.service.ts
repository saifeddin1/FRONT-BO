import { FeeCategory } from './../models/feeCatgory.model';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeCategoryService {

  constructor(private http:HttpClient) { }
  private BASE_URL: string = environment.Accounting;

  createFeeCategory(feeCategory:FeeCategory){
  
    return this.http.post<any>(`${this.BASE_URL}/api/feeCategory/`,feeCategory)
  }

  getFeeCatgories():Observable<any>{
   return this.http.get<any>(`${this.BASE_URL}/api/feeCategory/`); 
  }

  deleteFeeCategory(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/feeCategory/${id}`)
  }

  editById(id:string, element:any):Observable<any>{
   return this.http.put<any>(`${this.BASE_URL}/api/feeCategory/${id}`,element);
  }
}
