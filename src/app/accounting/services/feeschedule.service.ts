import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
