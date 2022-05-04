import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CantineService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(environment.LmsApiUrl+ "/api/cantine/getCantines")
  }
  deleteOne(id:any){
    return this.http.delete(environment.LmsApiUrl +"/api/cantine/deleteCantine/" + id)
  }

  addCantine(data:any){
    return this.http.post(environment.LmsApiUrl + "/api/cantine/addCantine", data)
  }

  update(id:any,data:any){
    return this.http.put(environment.LmsApiUrl +"/api/cantine/editCantine/" + id, data)
  }
}
