import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vc-notification',
  templateUrl: './vc-notification.component.html',
  styleUrls: ['./vc-notification.component.css']
})
export class VcNotificationComponent implements OnInit {
 
  constructor(private notificationService:NotificationService) { }
 notif:any={
  "notification":{
      "title":"test testtttttttttttttttttttttttttttttt",
      "body":"works !!!!!!!!!!!!!!!"
  },
  "to":"c6uuglocP3XCBmtM7iakSO:APA91bE8HE4J9ZyqsdVKVay7XNT9nkT2DojC4_rRNlKQ283jby3j0Cgyq8v_hJ7oFDX5foDrc9O_zy-Te6Xb36MikzoEVn38ejdlSiX4H_fHOypxbahNzbN2Au4Kj_AyAc40vEfp7AIK"
}
  ngOnInit(): void {
    this.notificationService.requestPerm("anbu")
  }
  notifier(){
    this.notificationService.notifier(this.notif)
    console.log(this.notif)
  }

}
