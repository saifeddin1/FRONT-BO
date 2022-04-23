import { Component, OnInit,ViewChild } from '@angular/core';
import { RecordsService } from '../../services/records.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vc-records',
  templateUrl: './vc-records.component.html',
  styleUrls: ['./vc-records.component.scss']
})
export class VcRecordsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  displayedColumns: string[] = ['course','class','subject','url','action'];


  courseName:any
  constructor(private recordsService:RecordsService,public MatDialog:MatDialog,private toast:ToastrService) { }
  records:any={};
  id:any;
  newRecord:any={
    courseName:"",
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
      courseName:"",
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
        this.toast.success("","Deleted successfully")
        this.ngOnInit()
      })
        
        
      
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
        this.toast.success("","Added successfully")
        this.closeModal()
      })
      console.log(this.newRecord)
  }
  


}
