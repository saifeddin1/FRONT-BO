import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http:HttpClient) { }

  getCompanies(){
        return this.http.get(environment.IdentityApi + '/api/v1/company/getCompanies')
    }

  addCompany(data:any){
      return this.http.post(environment.IdentityApi +"/api/v1/company/addCompany" ,data)
  }

  deleteCompany(id:any){
    return this.http.delete(environment.IdentityApi + "/api/v1/company/deleteCampany/" + id)
  }

  getOneById(id:any){
    return this.http.get(environment.IdentityApi +"/api/v1/company/getCompanybyId/" + id)
  }

}
