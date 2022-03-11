import { Program } from './../../models/program.model';
import { Academicterm } from './../../models/academicterm.model';
import { AcademictermService } from './../../services/academicterm.service';
import { AcademicyearService } from './../../services/academicyear.service';
import { GroupstudentService } from './../../services/groupstudent.service';
import { Academicyear } from './../../models/acadmicyear.model';
import { FeeStructure } from './../../models/feeStructure.model';
import { FeestructureService } from './../../services/feestructure.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../models/student.model';

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
 
  programs :any []=[];
  form1:FormGroup;
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    '#',
    'code',
    'name',
    'groupRollNumber',
    
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService,
     private feeStructureService: FeestructureService, private groupstudentService: GroupstudentService,
     private academicyearService:AcademicyearService) {
      this.getallacademicyears();
   }

  ngOnInit(): void {
    this.createForm();
    this.createForm1();
  }
 

  
  dataSource: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getStudents(){
    this.groupstudentService.getStudents().subscribe(
      (res)=>{
        const filterStudent= (student, index, array)=>{
    
  
          if(student.program == this.form1.value.program && student.academicterm == this.form1.value.academicterm && student.academicyear == this.form1.value.academicyear && Number(this.form1.value.maxsize) >0 ){
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
        console.error(error)
      }
    )
  }
 createForm1(){
  this.form1 = this.formBuilder.group({
    _id: '',
    program: ['', [Validators.required]],
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
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      code: body.code,
      grouprollnumber: body.groupRollNumber,
     
    });
  }

  modalType: string ;
  openModal() {
    this.clrModalOpen = true;
      this.modalType = 'edit';
    
  }

  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
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
      console.log("iiiid", student._id)
      
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
    
    this.fillFormModel(body);
    
    this.openModal();
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

//search
  sendData(event:any){
  this.ismatch=true;
  let query:string = event.target.value;
   
   
  
  //nothing or empty query
  let matchSpaces:any =query.match(/\s*/);
  if(matchSpaces[0]=== query  ){
   this.programs=[]
  
   return;
 }
  this.groupstudentService.searchPrograms(query.trim()).subscribe(results =>{
    this.programs= results;
    
    console.log(results)
   
  })
}

// Save student group first save 
saveStudentGroup(){
  const program={
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

 getallacademicterms(){
 
   this.academicyearService.getOneAcademicyearterms(this.form1.value.academicyear).subscribe(
     (res)=>{
      
       this.academicterms = res.response.terms ;
     }
   )
 }

 




}
