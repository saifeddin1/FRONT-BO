import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../constants/env';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  
  constructor(private http: HttpClient) { }

  getAllEvents(){
    return this.http.get(env.VCURL + "/VC/getEvents")
  }
}
