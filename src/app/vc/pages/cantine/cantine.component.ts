import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/lms/models/user.model';
import { CantineService } from '../../services/cantine.service';
import { FormGroup } from '@angular/forms';
import {Cantine} from '../../models/cantine'
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import { getToken } from '../../constants/getToken';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-cantine',
  templateUrl: './cantine.component.html',
  styleUrls: ['./cantine.component.css']
})
export class CantineComponent implements OnInit {
  cantines:any;
  id:any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  displayedColumns: string[] = ['day','menu','action'];
  meal={
    day:"",
    menu:""
  }
  user:any;


  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0,
  };
  week=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  tt=['zaeaze']
  
  dataSource: MatTableDataSource<Cantine> = new MatTableDataSource<Cantine>();
  constructor(private cantineService:CantineService,public MatDialog:MatDialog,private Toast:ToastrService) { }
  
  openModal(templateRef,id){
    this.MatDialog.open(templateRef)
    this.id=id

  }
  
  ngOnInit() {
    this.getAll()
    this.user=jwt_decode(getToken())
    console.log(this.user)
  }

  getAll(){
      
      this.cantineService.getAll().subscribe(res=>{
      this.cantines=res['response']
      console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
      console.log(this.week.length)
      let contLength=this.cantines.length
      let index=0
      while (index<contLength){
        for (let i=0; i<this.week.length; i++){
            if (this.week[i].includes(this.cantines[index].day)){
              console.log('yes exist')
              this.week.splice(i,1)
            }
            else{
              console.log("nooo")
            }
        }
        index=index+1
      }
    })
  }

  addNewMeal(){
    if (this.meal.day=="" || this.meal.menu=="" ){
      this.Toast.warning("","Verify your infos")
    }
    else {
         this.cantineService.addCantine(this.meal).subscribe(res=>{
        this.Toast.success("","Added successfully")
        this.MatDialog.ngOnDestroy()
        this.ngOnInit()
        this.meal={
          day:"",
          menu:""
        }
    })
    }
 
    
    
  }

  deleleCantine(id:any){
    this.cantineService.deleteOne(id).subscribe(
      res=>{
      
    }) 
    this.ngOnInit();
  }
  updateMeal(){
    if (this.meal.day=="" || this.meal.menu=="" ){
      this.Toast.warning("","Verify your infos")
    }else {
          this.cantineService.update(this.id,this.meal).subscribe(res=>{
            this.Toast.success("","Updated successfully")
            this.MatDialog.ngOnDestroy()
            this.ngOnInit()
            this.meal={
              day:"",
              menu:""
            }
        })
      }
    }
    
}
