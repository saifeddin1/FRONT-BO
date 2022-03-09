import { Academicyear } from './../../models/acadmicyear.model';
import { Academicterm } from './../../models/academicterm.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AcademictermService } from '../../services/academicterm.service';
import { MatTableDataSource } from '@angular/material/table';
import { AcademicyearService } from '../../services/academicyear.service';

@Component({
  selector: 'app-academicterm',
  templateUrl: './academicterm.component.html',
  styleUrls: ['./academicterm.component.css']
})
export class AcademictermComponent implements OnInit {
  academicterm:  object[] = [];
  academicyears: object[]= [];
  filtredata = {
   
    _id :'',
    name:'',
    termname:'',
    description:''

  }
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    
    'name',
    'termname',
    'description',
   
     'action'
   
    
  ];
  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService, private academictermService:AcademictermService, private academicyearService:AcademicyearService) { 
    this.getallAcademicterm()
    this.getallacademicyear()
  }

  ngOnInit(): void {
    this.createForm();
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  getallAcademicterm(){
    this.academictermService.getAcademicterms().subscribe(
      (res)=>{
       for(let i=0;i<res.response.length ;i++){
        this.filtredata.name = res.response[i].name ;

         for(let j =0; j<res.response[i].terms.length;j++){

            var x = {
              
              _id :res.response[i].terms[j]._id,
              name: res.response[i].name ,
              termname:res.response[i].terms[j].name,
              description:res.response[i].terms[j].description

            }
            
            

       
            this.academicterm.push(x);
         }
         
       }
      
       this.dataSource = new MatTableDataSource(this.academicterm);


      },
      (error)=>{
        console.error(error)
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
      name: body.termname,
      description: body.description,
      academicyearid: body.academicyearid,
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
        this.getallAcademicterm();
      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }



}
