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


  private VCAPI = 'http://localhost:3000/LMS/VC/';

   constructor(private http: HttpClient) { }
  // private _refreshNeeded$=new Subject<void>();

  // get refreshNeeded (){
  //   return this._refreshNeeded$;
  // }

  getAll() {

    return this.http.get(this.VCAPI + 'getMeets');

  }

  ADDVC(data:any){
      return this.http.post(this.VCAPI + 'addMeet' ,data);
  }

  deleteOne(id:any) {

    return this.http.delete(this.VCAPI + 'deleteMeet/'+id);

  }
}
