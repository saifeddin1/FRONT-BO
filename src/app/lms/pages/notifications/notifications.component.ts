import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { getToken } from '../../constants/getToken';
import jwtDecode from 'jwt-decode';
import { formatDate } from 'src/app/hr/helpers/formatDate';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  displayedColumns: string[] = ['title','body','niveau','creationDate','action'];

  constructor(private MatDialog:MatDialog, private NotificationService:NotificationService,private ToastrService:ToastrService) { }
  user:any
  id:any
  date=formatDate(new Date())
  notification:any={
    title:"",
    body:"",
    niveau:"",
    userName:"",
    creationDate:formatDate(new Date()) 
  }
  notifications:any=[]
  ngOnInit(): void {

    console.log(this.date)
    this.user=jwtDecode(getToken()) 
    this.notification.userName=this.user.username
    console.log(this.notification)
    
    console.log(this.user)
    this.NotificationService.requestPerm(this.user.username)

    this.getSavedNotifications()
    console.log(this.notifications);
  }
  
  openModal(templateRef,id){
      this.id=id
      this.MatDialog.open(templateRef)
  }
  closeModal(){
    this.MatDialog.ngOnDestroy()
  }


  saveNotification(){
    this.NotificationService.saveNotification(this.notification).subscribe(res=>{
      this.ToastrService.success('',"sent and saved successfully")
    })
  }

  sendNotification(){
    
    console.log(this.notification)
    console.log(this.notification)
      this.NotificationService.notifier(this.notification).subscribe(res=>{
        
            
      })
      this.closeModal()
      this.saveNotification()
      this.ngOnInit()
      
  }

  getSavedNotifications(){
    this.NotificationService.getSavedNotifications().subscribe(
      res=>{
        console.log(res);
        this.notifications = res['response']
    })
  }

  deleteNotification(){
      this.NotificationService.deleteNotification(this.id).subscribe(res=>{
              this.MatDialog.ngOnDestroy()
              this.ngOnInit()
              this.ToastrService.success('',"deleted successfully")
      })
  }
}
