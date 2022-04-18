import { Component, OnInit } from '@angular/core';
import { VcChatService } from '../../services/vc-chat.service';
import { formatDate } from '../../constants/formatDate';

@Component({
  selector: 'app-chat-class',
  templateUrl: './chat-class.component.html',
  styleUrls: ['./chat-class.component.css']
})
export class ChatClassComponent implements OnInit {

  message: string;
  messages: string[] = [];
  
  today = new Date();
  date = this.today.getFullYear()+'-'+( this.today.getMonth()+1)+'-'+ this.today.getDate()
  constructor(private chatService: VcChatService) { }
  msgs:any=[{
    message:"",
    userId:"",
    createdAt:new Date()
  }]

  msgToSend:any={
    niveau:"dsi31",
    message:"",
    userId:"aziz",
    createdAt:new Date(this.date)
  }

  ngOnInit(): void {
    this.getByNidId()
    this.chatService.listen('test event').subscribe((data)=>{
      console.log(data)
    })
    this.chatService
      .getMessages()
      .subscribe(() => {

        this.getByNidId()
           
      });
      
  }
  ngOnDestroy() {
    this.chatService.disconnect();
  }

  sendMsg(){
    this.chatService.addMsg(this.msgToSend).subscribe(res=>{

    });
    const socketChannel:String="VCChatMsg"
    console.log(this.msgToSend)  
    this.chatService.emit(socketChannel,this.msgToSend.message)
   
      
   
  }
  
  getByNidId(){
    this.chatService.getByNidId('dsi31').subscribe(res=>{
      this.msgs = res['response'].map((body: any) => ({
        message:body?.message,
        userId:body?.userId ,
        createdAt: formatDate(body?.createdAt)
        
      }
      ),
      console.log(this.msgs),
      console.log(res['response'])
      );
    })
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
