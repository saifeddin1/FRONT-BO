import { Injectable } from "@angular/core";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase'
import { env } from "../../vc/constants/env";

@Injectable()
export class NotificationService{
    // messaging=firebase.default
    currentMessage = new BehaviorSubject(null);
    constructor(private angularFirebaseMessaging: AngularFireMessaging, private http:HttpClient){
    }

    async requestPerm(userName){
        await this.angularFirebaseMessaging.requestToken.subscribe((token)=>{
                console.log(token)
                window.localStorage.setItem("notif_token", token);

            
            
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
        return  this.http.post(env.VCURL + "/VC/sendNotification", data);
    }
    saveNotification(data:any){
        return  this.http.post(env.VCURL + "/VC/addNotification", data);
    }
    
    getSavedNotifications(){
        return this.http.get(env.VCURL + "/VC/getNotifications")
    }

    deleteNotification(id:any){
        return this.http.delete(env.VCURL + "/VC/deleteNotification/" + id)
    }
}
