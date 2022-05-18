import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http:HttpClient) { }

  getCompanies():Observable<any>{
        return this.http.get<any>(environment.IdentityApi + '/api/v1/company/getCompanies')
    }

  addCompany(data:any):Observable<any>{
      return this.http.post<any>(environment.IdentityApi +"/api/v1/company/addCompany" ,data)
  }

  deleteCompany(id:any):Observable<any>{
    return this.http.delete<any>(environment.IdentityApi + "/api/v1/company/deleteCampany/" + id)
  }

  getOneById(id:any):Observable<any>{
    return this.http.get<any>(environment.IdentityApi +"/api/v1/company/getCompanybyId/" + id)
  }
  geByowner(id:any):Observable<any>{
    return this.http.get<any>(environment.IdentityApi +"/api/v1/company/companybyowner/" + id)
  }
  editcompany(id:any,data:any):Observable<any>{
    return this.http.get<any>(environment.IdentityApi +"/api/v1/company/editCompany/" + id , data)
  }

}
