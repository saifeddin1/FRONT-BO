import { Injectable } from "@angular/core";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase'

@Injectable()
export class NotificationService{
    // messaging=firebase.default
    currentMessage = new BehaviorSubject(null);
    constructor(private angularFirebaseMessaging: AngularFireMessaging, private http:HttpClient){
    }

    requestPerm(userName){
        this.angularFirebaseMessaging.requestToken.subscribe((token)=>{
   
            console.log(token);
            console.log(token.length)
            
        },
        (err)=>
        {
            console.error("No Permission "+ err);
        })
    }

    // receiveMessage() {
    //     this.messaging.onMessage(payload => {
    //       console.log('Message received. ', payload);
    //       this.currentMessage.next(payload);
    //     });
    //   }

    notifier(data:any){
        this.http.post("https://fcm.googleapis.com/fcm/send",data);
    }
}
