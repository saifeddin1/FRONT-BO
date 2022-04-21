import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../constants/env';

@Injectable({
  providedIn: 'root'
})
export class CantineService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(env.VCURL+ "/VC/getCantines")
  }
  deleteOne(id:any){
    return this.http.delete(env.VCURL +"/VC/deleteCantine/" + id)
  }

  addCantine(data:any){
    return this.http.post(env.VCURL + "/VC/addCantine", data)
  }

  update(id:any,data:any){
    return this.http.put(env.VCURL +"/VC/editCantine/" + id, data)
  }
}
