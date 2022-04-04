import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private VCURL = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getAll() {

    return this.http.get(this.VCURL + '/VC/getRecord');

  }
  deleteRecord(id:any){
    return this.http.delete(this.VCURL + '/VC/deleteRecord/' + id)
  }

  updateRecord(id:any,data:any){
    return this.http.put(this.VCURL + "/VC/updateRecord/"+ id , data);
  }

  getOneRecord(id:any){
      return this.http.get(this.VCURL +"/VC/getOneRecord/"+ id)
  }
  addRecord(data:any){
    return this.http.post(this.VCURL + "/VC/addRecord", data )
  }
}
