import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  constructor(private http:HttpClient) { }

  getAlldeps():Observable<any>{
    return this.http.get<any>(environment.IdentityApi +"/api/v1/departement/getDepartements")
  }

  getByCompanyId(id:any):Observable<any>{
    return this.http.get<any>(environment.IdentityApi +"/api/v1/departement/depByCompanyid/" + id)
  }

  addDepartement(data:any):Observable<any>{
    return this.http.post<any>(environment.IdentityApi + "/api/v1/departement/addDepartement" ,data)
  }
}


