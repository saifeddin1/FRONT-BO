import { Academicyear } from './../../models/acadmicyear.model';
import { Academicterm } from './../../models/academicterm.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AcademictermService } from '../../services/academicterm.service';
import { MatTableDataSource } from '@angular/material/table';
import { AcademicyearService } from '../../services/academicyear.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-academicterm',
  templateUrl: './academicterm.component.html',
  styleUrls: ['./academicterm.component.css']
})
export class AcademictermComponent implements OnInit {
  academicterm:  object[] = [];
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  academicyears: object[]= [];
  filtredata = {
   
    _id :'',
    name:'',
    termname:'',
    description:''

  }
  clrModalOpen: boolean = false;
  clrModalOpen1: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    
    'name',
   
    'description',
   
     'action'
   
    
  ];
  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService, private academictermService:AcademictermService, private academicyearService:AcademicyearService) { 
    this.getallAcademicterm()
    this.getallDisabledAcademicterm();
    this.getallacademicyear()
  }

  ngOnInit(): void {
    this.createForm();
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.getallAcademicterm()

  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  getallAcademicterm(){
    this.academictermService.getAcademicterms().subscribe(
      (res)=>{
       
       console.log("academic term response", res.response)
       this.dataSource = new MatTableDataSource(res.response);
       this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.p;
          this.paginator.length =
            res.response.length || 0;
        });
      
        this.total = res.response.length || 0;

      },
      (error)=>{
        console.error("get academic term error:",error)
      }
    )
  }

  dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>();

  getallDisabledAcademicterm(){
    this.academictermService.getDisabledAcademicterms().subscribe(
      (res)=>{
       
       console.log("academic term response", res.response)
       this.dataSource1 = new MatTableDataSource(res.response);


      },
      (error)=>{
        console.error("get academic term error:",error)
      }
    )
  }

  getallacademicyear(){
    this.academicyearService.getAcademicyears().subscribe(
      (res)=>{
       this.academicyears = res.response;
      },
      (error)=>{
        console.log(error)
      }
      )
      
    

  }

  
  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      academicyearid: ['', [Validators.required]],
      
      
     
    }) as FormGroup & Academicterm ; 
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      description: body.description,
      academicyearid: body.academicyear,
    });
  }

  modalType: string = 'add';
  openModal(type ='add') {
    this.clrModalOpen = true;
    if (type == 'add') {
      this.modalType = 'add';
      this.createForm();
    } else {
      this.modalType = 'edit';
    }
  }

  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }
  closeModal1() {
    
    this.clrModalOpen1 = false;
  }
  
  openModal1() {
    
    this.clrModalOpen1 = true;
  }

  onSubmit(){
    if(this.form.value){

     
      const academicterm={
        name : this.form.value.name,
        description : this.form.value.description,
        
        

      }
      
      if(this.modalType === 'add'){
        this.academictermService.createAcademicterm(academicterm,this.form.value.academicyearid).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.academicterm = [];
            this.getallAcademicterm();
            this.closeModal()
          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.academictermService.editById(this.form.value._id,academicterm).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.academicterm = [];
            this.getallAcademicterm();
            this.closeModal();
          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    }
  }

  editById(body: any) {
    
    this.fillFormModel(body);
    this.openModal('edit');
  }

  delete(id:string){
    
    this.academictermService.deleteAcademicterm(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully");
        this.academicterm= [];
        this.getallAcademicterm()
        this.getallDisabledAcademicterm();
      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }

  restore(id:string){
    this.academictermService.restore(id).subscribe(
      (res)=>{
      this.getallDisabledAcademicterm();
      this.getallAcademicterm();  
      this.toasterService.success("restored successfully")
      
      
      },
      (err)=>{
        console.log("restore errror", err)
        this.toasterService.error('restore error');
      }
    )
  }


}
