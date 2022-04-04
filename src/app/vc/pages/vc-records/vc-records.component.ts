import { Component, OnInit } from '@angular/core';
import { RecordsService } from '../../services/records.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-vc-records',
  templateUrl: './vc-records.component.html',
  styleUrls: ['./vc-records.component.scss']
})
export class VcRecordsComponent implements OnInit {
  courseName:any
  constructor(private recordsService:RecordsService,public MatDialog:MatDialog) { }
  records:any={};
  id:any;
  newRecord:any={
    updateRecord:"",
    url:"",
    class:"",
    subject:"",
  }
  ngOnInit() {
    this.recordsService.getAll().subscribe(res=>{
      this.records=res['response']
      console.log(this.records);
    })
    this.newRecord={
      updateRecord:"",
      url:"",
      class:"",
      subject:"",
    }
  }
  closeModal(){
    this.MatDialog.ngOnDestroy()
    this.ngOnInit()
  }
  openModal(templateRef,id){
     this.MatDialog.open(templateRef)
     this.id=id;
    //  if (templateRef==="editTemp"){
      this.getOneRec(this.id)
  // }
  }

  deleteRecord(){
      this.recordsService.deleteRecord(this.id).subscribe(res=>{
      })
        
        this.closeModal()
      
  }
  updateRecord(){
    
        console.log(this.newRecord,this.id)
        console.log(this.id)
        this.recordsService.updateRecord(this.id,this.newRecord).subscribe(res=>{
              this.closeModal()
              
        })
  }

  getOneRec(id){
    this.recordsService.getOneRecord(this.id).subscribe(res=>{
      this.newRecord=res['response']
      console.log(this.newRecord)
    })
  }

  addNewRec(){
    
      this.recordsService.addRecord(this.newRecord).subscribe(rese=>{
        this.closeModal()
      })
  }


}
