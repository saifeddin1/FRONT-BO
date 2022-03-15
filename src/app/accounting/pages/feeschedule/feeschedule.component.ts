import { FeescheduleService } from './../../services/feeschedule.service';
import { element } from 'protractor';

import { Program } from './../../models/program.model';
import { Academicterm } from './../../models/academicterm.model';
import { AcademicyearService } from './../../services/academicyear.service';
import { GroupstudentService } from './../../services/groupstudent.service';
import { Academicyear } from './../../models/acadmicyear.model';
import { FeeStructure } from './../../models/feeStructure.model';
import { FeestructureService } from './../../services/feestructure.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../models/student.model';
import { StudentGroup } from '../../models/studentgroup.model';

@Component({
  selector: 'app-feeschedule',
  templateUrl: './feeschedule.component.html',
  styleUrls: ['./feeschedule.component.css']
})
export class FeescheduleComponent implements OnInit {
  ismatch:boolean= false;
  test:string = "test";
  feestruct ={
    
    program:'',
    academicyear:'',
    academicterm:'',
    studentcat:''

  };
  studentgrouptable:StudentGroup[]=[
   
  ];
  studentgroups:[]=[];
  feeStructures:[]=[];
  studentsId:any []=[];
  
 
  form1:FormGroup;
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    
    'studentgroup',
    'totalestudent',
  
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService,
     private feeStructureService: FeestructureService, private groupstudentService: GroupstudentService,
     private feescheduleService:FeescheduleService) {
      this.getfeeStructure();
      this.getstudentgroup();
   }

  ngOnInit(): void {
    this.createForm();
    this.createForm1();
    
  }
 

  
  getfeeStructure(){
    this.feeStructureService.getFeestructures().subscribe(
      (res)=>{
        
        this.feeStructures = res.response;
        console.log("fee structures:",this.feeStructures) 
      },
      (error)=>{
        console.error(error)
      }
    )
  }
  getstudentgroup(){
    this.groupstudentService.getStudentgroup().subscribe(
      (res)=>{
        
        this.studentgroups = res.response;
        console.log("fee structures:",this.studentgroups) 
      },
      (error)=>{
        console.error(error)
      }
    )
  }
 createForm1(){
  this.form1 = this.formBuilder.group({
    _id: '',
    studentgroup: ['', [Validators.required]],
    totalestudent: ['', [Validators.required]],
    
    
    
   
  }) as FormGroup ; 

 }
  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      feestructure: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      program: ['', [Validators.required]],
      academicyear: ['', [Validators.required]],
      academicterm: ['', [Validators.required]],
      studentcategory: ['', [Validators.required]],
      
      
     
    }) as FormGroup ; 
  }



  modalType: string ;
  openModal() {
    this.clrModalOpen = true;
      this.modalType = 'add';
    
  }

  closeModal() {
    this.createForm1();
    this.clrModalOpen = false;
  }

 

// Save student group first save 
savefeeshcedule(){
  const feeschedule={
    feeStructureId : this.form.value.feestructure,
    dueDate : this.form.value.duedate,
    
    studentgroup:this.studentgrouptable,
  }
    
  this.feescheduleService.createFeeschedule(feeschedule).subscribe
  (
    (result)=>{
            
      console.log(result)
      this.toasterService.success("Created successfully")
      

    },
    (err)=>{
      console.log(err)
      this.toasterService.error('Something wrong ')
    }
  )
  

}






 //set value to other inputs
 setinput(id:string){
  
   this.feeStructureService.getFeestructures().subscribe(
    (res)=>{
      for(var i=0; i< res.response.length;i++){
        
        if(res.response[i]._id == id){
          this.feestruct.studentcat = res.response[i].studentCategory;
          this.feestruct.academicyear = res.response[i].academicyear;
          this.feestruct.academicterm = res.response[i].academicterm;
          this.feestruct.program = res.response[i].program;
          
        }
      }
     
    },
    (error)=>{
      console.error(error)
    }
  )
 
  }
  dataSource: MatTableDataSource<StudentGroup> = new MatTableDataSource<StudentGroup>();
  addstudentgrouptotable(){
    const studg= {
      name: this.form1.value.studentgroup,
      numtot: this.form1.value.totalestudent
    }
   

    this.studentgrouptable.push(studg)
    this.dataSource = new MatTableDataSource(this.studentgrouptable);
  }
}
