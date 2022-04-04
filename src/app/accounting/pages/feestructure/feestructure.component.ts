import { Academicyear } from './../../models/acadmicyear.model';
import { FeeStructure } from './../../models/feeStructure.model';
import { FeestructureService } from './../../services/feestructure.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';
import { AcademicyearService } from '../../services/academicyear.service';
import { Academicterm } from '../../models/academicterm.model';
import { ProgramService } from '../../services/program.service';
import { Program } from '../../models/program.model';
import { FeeCategoryService } from '../../services/fee-category.service';
import { FeeCategory } from '../../models/feeCatgory.model';
import { AcademictermService } from '../../services/academicterm.service';

@Component({
  selector: 'app-feestructure',
  templateUrl: './feestructure.component.html',
  styleUrls: ['./feestructure.component.css']
})
export class FeestructureComponent implements OnInit {

  academicterms:Academicterm []=[];
  academicyears:Academicyear []=[];
  programs:Program []=[];
  feeCtaegories:FeeCategory[]=[];
  feestructures : any[]=[];
 
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    '#',
    'name',
    'program',
    'academicyear',
    'academicterm',
    'studentCategory',
    'feeCategory',
    'description',
    'amount',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];


 

  constructor( private academictermService : AcademictermService,private feeCategoryService:FeeCategoryService,private programService: ProgramService,private academicyearService:AcademicyearService,private formBuilder: FormBuilder,private toasterService: ToasterService, private feeStructureService: FeestructureService) {
    this.getallfeestructures();
    this.getallacademicyears();
    this.getallprograms();
    this.getallfeeCategory();
   }

  ngOnInit(): void {
    this.createForm();
  }

  
  dataSource: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getallfeestructures(){
    this.feeStructureService.getFeestructures().subscribe(
      (res)=>{
        
        for(var i=0; i< res.response.length;i++){
          var p;
          var feestruct =  {
            name:'',
            program:'',
            academicyear:'',
            academicterm:'',
            studentCategory:'',
            feeCategory:'',
            description:'',
            amount:'',
        
          };
          

          feestruct.name= res.response[i].name;
          feestruct.studentCategory= res.response[i].studentCategory;
          feestruct.description= res.response[i].description;
          feestruct.amount= res.response[i].amount;
          
          this.programService.getOneProgram(res.response[i].program).subscribe(
            (res)=>{
              
              feestruct.program= res.response.name;
              
              
            }
          )

          this.academicyearService.getOneAcademicyear(res.response[i].academicyear).subscribe(
            (res)=>{
              feestruct.academicyear= res.response.name;
              
            }
          )

          
          this.academictermService.getOneAcademicterm(res.response[i].academicterm).subscribe(
            (res)=>{
              feestruct.academicterm= res.response.name;
              
            }
          )

          this.feeCategoryService.getOneFeeCatgory(res.response[i].feeCategory).subscribe(
            (res)=>{
              feestruct.feeCategory= res.response.name;
              
            }
          )
          
        
        
        this.feestructures.unshift(feestruct);
        

        
        } 
        this.dataSource = new MatTableDataSource(this.feestructures);
        
      },
      (error)=>{
        console.error(error)
      }
    )
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      program: ['', [Validators.required]],
      academicyear: ['', [Validators.required]],
      academicterm: ['', [Validators.required]],
      studentCategory: ['', [Validators.required]],
      feeCategory: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      
     
    }) as FormGroup & FeeStructure; 
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name:body.name,
      program: body.program,
      academicyear: body.academicyear,
      academicterm: body.academicterm,
      studentCategory: body.studentCategory,
      feeCategory: body.feeCategory,
      description: body.description,
      amount: body.amount
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
      console.log('this.formModel.value : ', this.form.value);

     
      const program={
        name:this.form.value.name,
        program : this.form.value.program,
        academicyear : this.form.value.academicyear,
        academicterm: this.form.value.academicterm,
        studentCategory: this.form.value.studentCategory,
        feeCategory: this.form.value.feeCategory,
        description: this.form.value.description,
        amount: this.form.value.amount,
    }
    
      
      
      if(this.modalType === 'add'){
        this.feeStructureService.createFeestructure(program).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.getallfeestructures();

          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.feeStructureService.editById(this.form.value._id,program).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.getallfeestructures();

          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    }
  }

  editById(body: Partial<FeeStructure>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  deleteProgram(id:string){
    this.feeStructureService.deleteFeestructure(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getallfeestructures();

      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }


// Get all academic year
getallacademicyears(){
  this.academicyearService.getAcademicyears().subscribe(
    (res) =>{
      this.academicyears = res.response;
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

//Get all fee Category
getallfeeCategory(){
  this.feeCategoryService.getFeeCatgories().subscribe(
    (res) =>{
      this.feeCtaegories = res.response;
    }
  )
}


getallacademicterms(){

  this.academicyearService.getOneAcademicyearterms(this.form.value.academicyear).subscribe(
    (res)=>{
     
      this.academicterms = res.response.terms ;
    }
  )
}


}
