import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../constants/env';
@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(private http: HttpClient) { }

  getAll() {

    return this.http.get(env.VCURL+ '/VC/getRecords');

  }
  deleteRecord(id:any){
    return this.http.delete(env.VCURL + '/VC/deleteRecord/' + id)
  }

  updateRecord(id:any,data:any){
    return this.http.put(env.VCURL + "/VC/updateRecord/"+ id , data);
  }

  getOneRecord(id:any){
      return this.http.get(env.VCURL +"/VC/getOneRecord/"+ id)
  }
  addRecord(data:any){
    return this.http.post(env.VCURL + "/VC/addRecord", data )
  }
  

}
