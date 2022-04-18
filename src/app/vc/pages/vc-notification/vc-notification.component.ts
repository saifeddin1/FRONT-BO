import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { getToken } from '../../constants/getToken';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-vc-notification',
  templateUrl: './vc-notification.component.html',
  styleUrls: ['./vc-notification.component.css']
})
export class VcNotificationComponent implements OnInit {
  user:any
  constructor(private notificationService:NotificationService) { }

  ngOnInit(): void {
    this.user=jwt_decode(getToken())
    console.log(this.user)
    this.notificationService.requestPerm(this.user.username)
  }


  notify(){
    this.notificationService.notifier().subscribe(res=>{
      
    })
  }


}
