import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeescheduleService {

  constructor(private http:HttpClient) { }

  private BASE_URL: string = environment.Accounting;

  createFeeschedule(feeschedule:any){
  
    return this.http.post<any>(`${this.BASE_URL}/api/feeschedule/`,feeschedule)
  }
  getFeesschedule():Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/feeschedule/`); 
   }

   getOneFeestructures(id:string):Observable<any>{
    return this.http.get<any>(`${this.BASE_URL}/api/feeStructure/${id}`); 
   }

   editfeeschedule(id:string, element:any):Observable<any>{
    console.log("element edit",element)
    return this.http.put<any>(`${this.BASE_URL}/api/feeschedule/${id}`,element);
  }

  deletefeeschedule(id:string):Observable<any>{
    return this.http.delete(`${this.BASE_URL}/api/feeschedule/${id}`)
  }

}
