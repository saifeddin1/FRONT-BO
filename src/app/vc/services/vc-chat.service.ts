import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';
import { env } from '../constants/env';

@Injectable({
  providedIn: 'root'
})
export class VcChatService {
  socket:any;
  constructor(private http: HttpClient) { 
    this.socket = io(env.VCURL, {transports: ['websocket', 'polling', 'flashsocket']});
  }
  
  sendMessage(data): void {
    this.socket.emit('message', data);
  }

  
  listen(eventName:String){
    return new Observable((subscriber)=>{
      this.socket.on(eventName,(data)=>{
        subscriber.next(data);
      })
    })
  }


  emit(eventName:String,msg:any){
    this.socket.emit(eventName, msg);
    this.socket.on('my broadcast messageVC', (data: string) => {
      console.log(data);
    });
    
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
}
  public getMessages () {
    return new Observable((observer) => {
        this.socket.on('VCChatMsg', (message) => {
            observer.next(message);
        });
    });
  }

  getAll() {

    return this.http.get(env.VCURL + '/VC/getMsg');

  }
  getByNidId(id:any) {

    return this.http.get(env.VCURL + '/VC/messagesByNivId/' + id);

  }

  addMsg(data:any){
      return this.http.post(env.VCURL + '/VC/addMsg' ,data);
  }

}
