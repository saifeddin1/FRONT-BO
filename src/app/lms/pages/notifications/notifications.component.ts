import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private MatDialog:MatDialog, private NotificationService:NotificationService) { }
  notif:any={
    title:"",
    body:"",
    token:"cp5ks42cfkAZ4CdTaGbfq9:APA91bFcQiH1EZLcJN8DB7av8hpzebgZFDGDmbChszmB2LiR_Z5wH8yilcweJjv5K_cuHjiRoKGPKnYZQiye77ftK0_DXBz84GONRml-ufRn4N_Szg-xT8c1w0X_eBF-YZfBDbO-PaS7"
  }
  ngOnInit(): void {
  }
  openModal(templateRef){
      this.MatDialog.open(templateRef)
  }


  sendNotification(){
    console.log(this.notif)
      this.NotificationService.notifier(this.notif).subscribe(res=>{

      })
  }
}
