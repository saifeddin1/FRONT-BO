import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io } from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VcChatService {
  socket:any;
  private socketUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { 
    this.socket = io(this.socketUrl, {transports: ['websocket', 'polling', 'flashsocket']});
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

    return this.http.get(this.socketUrl + '/LMS/VC/getMsg');

  }

  addMsg(data:any){
      return this.http.post(this.socketUrl + '/LMS/VC/addMsg' ,data);
  }

}
