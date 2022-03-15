import { Component, OnInit } from '@angular/core';
import { VcChatService } from 'src/app/services/vc-chat.service';

@Component({
  selector: 'app-vc-live-sessions',
  templateUrl: './vc-live-sessions.component.html',
  styleUrls: ['./vc-live-sessions.component.css']
})
export class VcLiveSessionsComponent implements OnInit {
  appppppp=document.getElementById('friends-chat')
  p = document.createElement("p");
  
  today = new Date();
  date = this.today.getFullYear()+'-'+( this.today.getMonth()+1)+'-'+ this.today.getDate()
  constructor(private chatService: VcChatService) { }
  msgs:any=[{
    message:"",
    userId:"",
    createdAt:new Date()
  }]

  msgToSend:any={
    message:"sdd",
    userId:"aziz",
    createdAt:new Date(this.date)
  }

  ngOnInit(): void {
    this.chatService.listen('test event').subscribe((data)=>{
      console.log(data)
    })
    this.getAll()
  }
  ngOnDestroy() {
    this.chatService.disconnect();
  }

  sendMsg(){
    
    const socketChannel:String="VCChatMsg"
    console.log(this.msgToSend)  
    this.chatService.emit(socketChannel,this.msgToSend.message)  
    this.p.textContent="hi"
    this.appppppp.appendChild(this.p)

   
      
   
  }
  getAll() {
    this.chatService.getAll().subscribe(
      res=>{

        this.msgs = res['response'].map((body: any) => ({
          message:body?.message,
          userId:body?.userId ,
          createdAt: body?.createdAt
          
        }
        ),
        console.log(this.msgs),
        console.log(res['response'])
        );
      }
    )
  }

}
