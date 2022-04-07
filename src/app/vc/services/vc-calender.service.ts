import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../constants/env';

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



   constructor(private http: HttpClient) { }
  // private _refreshNeeded$=new Subject<void>();

  // get refreshNeeded (){
  //   return this._refreshNeeded$;
  // }

  getAll() {

    return this.http.get(env.VCURL + '/VC/getAllSeances');

  }

  addSeance(data:any){
      return this.http.post(env.VCURL + '/VC/addSeance' ,data);
  }

  deleteOne(id:any) {

    return this.http.delete(env.VCURL + '/VC/deleteSeance/'+id);

  }
  updateSeance(id:any, data:any){
    return this.http.put(env.VCURL +'/VC/updateSeance/'+id , data)
  }

  getOneSeance(id:any){
    return this.http.get(env.VCURL+ '/VC/findSeanceById/' + id)
  }
}
