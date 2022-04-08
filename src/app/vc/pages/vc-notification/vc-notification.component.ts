import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vc-notification',
  templateUrl: './vc-notification.component.html',
  styleUrls: ['./vc-notification.component.css']
})
export class VcNotificationComponent implements OnInit {

  constructor(private notification:NotificationService) { }

  ngOnInit(): void {
    this.notification.requestPerm("anbu")
  }

}
