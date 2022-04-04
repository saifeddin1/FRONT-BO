import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }
}
@Injectable({
  providedIn: 'root'
})
export class VcCalenderService {


  private VCURL = 'http://localhost:3000/VC/';

   constructor(private http: HttpClient) { }
  // private _refreshNeeded$=new Subject<void>();

  // get refreshNeeded (){
  //   return this._refreshNeeded$;
  // }

  getAll() {

    return this.http.get(this.VCURL + 'getMeets');

  }

  addVC(data:any){
      return this.http.post(this.VCURL + 'addMeet' ,data);
  }

  deleteOne(id:any) {

    return this.http.delete(this.VCURL + 'deleteMeet/'+id);

  }
}
