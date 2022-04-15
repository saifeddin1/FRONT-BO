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
import { AcademictermService } from '../../services/academicterm.service';
import { ProgramService } from '../../services/program.service';

@Component({
  selector: 'app-groupstudent',
  templateUrl: './groupstudent.component.html',
  styleUrls: ['./groupstudent.component.css']
})
export class GroupstudentComponent implements OnInit{
  ismatch:boolean= false;
  students:[]=[];
  studentsId:any []=[];
  academicterms:Academicterm []=[];
  academicyears:Academicyear []=[];
  studentgroup: any []=[];
  form2:FormGroup;
  programs :any []=[];
  form1:FormGroup;
  clrModalOpen: boolean = false;
  clrModalOpen3: boolean = false;
  clrModalOpenEdit: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    '#',
    'code',
    'name',
    'groupRollNumber',
    
    
  ];
  displayedColumns1 : string[]=[
    
    '#',
    'name',
    'program',
    'academicyear',
    'academicterm',
    'maxsize',
    
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  

  constructor( private programService: ProgramService,private academictermService : AcademictermService,private formBuilder: FormBuilder,private toasterService: ToasterService,
     private feeStructureService: FeestructureService, private groupstudentService: GroupstudentService,
     private academicyearService:AcademicyearService) {
      this.getallacademicyears();
      this.getallprograms();
      this.getStudentsGroup();
   }

  ngOnInit(): void {
    this.createForm();
    this.createForm1();
    this.createForm2();
  }
 
  dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>();
  getStudentsGroup(){
    this.groupstudentService.getStudentgroup().subscribe(
      (res)=>{
        for(var i=0; i< res.response.length;i++){
          
          const studentgroup=  {
            _id:'',
            name:'',
            program:'',
            academicyear:'',
            academicterm:'',
            maxsize:'',
            enabled:''
         };
          studentgroup._id= res.response[i]._id;
          studentgroup.name= res.response[i].name;
          studentgroup.maxsize= res.response[i].maxsize;
          studentgroup.enabled= res.response[i].enabled;

          this.programService.getOneProgram(res.response[i].program).subscribe(
            (res)=>{
              
              studentgroup.program= res.response.name;
             
              
              
            }
          )

          this.academicyearService.getOneAcademicyear(res.response[i].academicyear).subscribe(
            (res)=>{
              studentgroup.academicyear= res.response.name;
             
              
            }
          )
          this.academictermService.getOneAcademicterm(res.response[i].academicterm).subscribe(
            (res)=>{
              studentgroup.academicterm= res.response.name;
              
            }
          )

          this.studentgroup.push(studentgroup);
        

      }
      this.dataSource1 = new MatTableDataSource(this.studentgroup);
    },
      (error)=>{
        console.error("get studentgroup error :",error)
      }

    )
  }
  dataSource: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getStudents(){
    this.groupstudentService.getStudents().subscribe(
      (res)=>{
        console.log("students list:",res.response)
        console.log("academicyear:",this.form1.value.academicyear)
        const filterStudent= (student, index, array)=>{
    
  
          if(student.academicterm == this.form1.value.academicterm && student.academicyear == this.form1.value.academicyear && Number(this.form1.value.maxsize) >0 ){
              this.form1.value.maxsize--;
              this.studentsId.push(student._id)
              return student;
      
          }
          
      
        }
      
       
         
        this.students = res.response.filter(filterStudent);
        this.dataSource = new MatTableDataSource(this.students);

        console.log("studentsId:",this.students)
      },
      (error)=>{
        console.error("get students error :",error)
      }
    )
  }
 createForm1(){
  this.form1 = this.formBuilder.group({
    _id: '',
    program: ['', [Validators.required]],
    name: ['', [Validators.required]],
    academicyear: ['', [Validators.required]],
    academicterm: ['', [Validators.required]],
    maxsize: ['', [Validators.required]],
    
    
   
  }) as FormGroup ; 
 }

 createForm2(){
  this.form2 = this.formBuilder.group({
    _id: '',
    program: ['', [Validators.required]],
    name: ['', [Validators.required]],
    academicyear: ['', [Validators.required]],
    academicterm: ['', [Validators.required]],
    maxsize: ['', [Validators.required]],
    
    
   
  }) as FormGroup ; 
 }

 
  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      grouprollnumber: ['', [Validators.required]],
      
      
     
    }) as FormGroup & Student; 
  }

  fillFormModel(body) {
    this.form2.patchValue({
      _id: body._id,
      name: body.name,
      program: body.program,
      academicyear: body.academicyear,
      academicterm: body.academicterm,
      maxsize : body.maxsize
     
    });
    console.log("form2 patch value",this.form2.value)
  }

  modalType: string ;
  openModal(type ='add') {
    this.clrModalOpen = true;
    if (type == 'add') {
      this.modalType = 'add';
      this.createForm();
    } else {
      this.modalType = 'edit';
    }
  }
  dataSource3: MatTableDataSource<any> = new MatTableDataSource<any>();
  openModal3(id:string){
    
    this.clrModalOpen3 = true;
    this.groupstudentService.getOneStudentgroup(id).subscribe(

      (res)=>{
        
        this.dataSource3 = new MatTableDataSource(res.response.students);
      

      },
      (error)=>{
        console.log("get stuednts",error)
      }
    )
  }
  closemodal3(){
    this.clrModalOpen3= false;
  }
  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }
  closeModaledit(){
    this.createForm2();
    this.clrModalOpenEdit = false;
  }

  onSubmit(){
    if(this.form.value){
      console.log('this.formModel.value : ', this.form.value);

     
      const student={
        _id:this.form.value._id,
        name : this.form.value.name,
        code : this.form.value.code,
        grouprollnumber: this.form.value.grouprollnumber,
      }
     
      
        this.groupstudentService.editStudent(student._id,student).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            location.reload();

          
          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    
  }

  editById(body: Partial<Student>) {
    console.log("edit by id element",body)
    this.fillFormModel(body);
    
    this.clrModalOpenEdit = true
    
  }

  editstudentgroup(){

    const studentgroup={
      name:this.form2.value.name,
      program : this.form2.value.program,
      academicyear : this.form2.value.academicyear,
      academicterm: this.form2.value.academicterm,
      studentCategory: this.form2.value.studentCategory,
      maxsize: this.form2.value.maxsize,
  }

  this.groupstudentService.editStudentgroup(this.form2.value._id, studentgroup).subscribe(
    (result)=>{
      console.log('edited successfully:',result);
      this.toasterService.success('Edited Successfully');
      this.getStudentsGroup();

    },(err)=>{
      console.log("edit error :",err)
      this.toasterService.error('Something wrong')
    }
  )

  }

  deleteStudent(id:string){
    this.groupstudentService.deleteStudent(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getStudents();
     

      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }


// Save student group first save 
saveStudentGroup(){
  const program={
    name : this.form1.value.name,
    program : this.form1.value.program,
    academicyear : this.form1.value.academicyear,
    academicterm: this.form1.value.academicterm,
    maxsize: this.form1.value.maxsize,
    students:this.studentsId}
    
  this.groupstudentService.createStudentGroup(program).subscribe
  (
    (result)=>{
            
      console.log(result)
      this.toasterService.success("Created successfully")
      this.getStudentsGroup();
      

    },
    (err)=>{
      console.log(err)
      this.toasterService.error('Something wrong ')
    }
  )
  

}
 




/* select option part */

 getallacademicyears(){
   this.academicyearService.getAcademicyears().subscribe(
     (res) =>{
       this.academicyears = res.response;
     }
   )
 }

 getallacademicterms(form='form1'){

   if(form== 'form2'){
    this.academicyearService.getOneAcademicyearterms(this.form2.value.academicyear).subscribe(
      (res)=>{
       
        this.academicterms = res.response.terms ;
      }
    )

   
   
  }else{
    this.academicyearService.getOneAcademicyearterms(this.form1.value.academicyear).subscribe(
      (res)=>{
       
        this.academicterms = res.response.terms ;
      }
    )


  }
 }

 

 deletestudentgroup(id:string){
   this.groupstudentService.deleteStudentgroup(id).subscribe(
     (res)=> {
       this.toasterService.success("deleted successfully")
       this.getStudentsGroup();
     },
     (error)=>{
       this.toasterService.error('something wrong')
       console.log("delete group student error",error)
     }
   )

   

 }

 //Get all programs
  getallprograms(){
  this.programService.getPrograms().subscribe(
    (res) =>{
      this.programs = res.response;
    }
  )
}


}
