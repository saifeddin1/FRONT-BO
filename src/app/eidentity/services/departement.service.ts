import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  constructor(private http:HttpClient) { }

  getAlldeps(){
    return this.http.get(environment.IdentityApi +"/api/v1/departement/getDepartements")
  }

  getByCompanyId(id:any){
    return this.http.get(environment.IdentityApi +"/api/v1/departement/depByCompanyid/" + id)
  }

  addDepartement(data:any){
    return this.http.post(environment.IdentityApi + "/api/v1/departement/addDepartement" ,data)
  }
}


