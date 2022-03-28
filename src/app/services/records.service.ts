import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private VCURL = 'http://localhost:3000/VC/';
  constructor(private http: HttpClient) { }

  getAll() {

    return this.http.get(this.VCURL + '/VC/getRecord');

  }

  addMsg(data:any){
      return this.http.post(this.VCURL + '/VC/addMsg' ,data);
  }

}
