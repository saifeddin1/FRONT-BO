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
import { validateVerticalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-feestructure',
  templateUrl: './feestructure.component.html',
  styleUrls: ['./feestructure.component.css']
})
export class FeestructureComponent implements OnInit {

  academicterms:Academicterm []=[];
  academicyears:Academicyear []=[];
  feecategorytotable:any []=[];
  programs:Program []=[];
  feeCtaegories:FeeCategory[]=[];
  feeCatId:string[]=[];
  feestructures : any[]=[];
 
  clrModalOpen: boolean = false;
  clrModalOpen1: boolean = false;
  form: FormGroup;
  form1: FormGroup;

  displayedColumns : string[]=[
 
    'name',
    'program',
    'academicyear',
    'academicterm',
   
    'description',
    'amount',
    'action' 
  ];
  displayedColumns3 : string[]=[
   
    'name',
    'program',
    'academicyear',
    'academicterm',
    'action' 
  ];
  displayedColumns1 : string[]=[
    
    'feeCategory',
    
    'amount',
   
  ];

  displayedOptionColumns: string[] = ['name', 'action'];


 

  constructor( private academictermService : AcademictermService,private feeCategoryService:FeeCategoryService,
    private programService: ProgramService,private academicyearService:AcademicyearService,private formBuilder: FormBuilder,private toasterService: ToasterService, private feeStructureService: FeestructureService) {
    this.getallfeestructures();
    this.getdisabledallfeestructures()
    this.getallacademicyears();
    this.getallprograms();
    this.getallfeeCategory();
   }

  ngOnInit(): void {
    this.createForm();
    this.createForm1();
  }

 
  dataSource: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getallfeestructures(){
    this.feeStructureService.getFeestructureswithname().subscribe(
      (res)=>{
        
        console.log("get fee structures", res.response)
        this.dataSource = new MatTableDataSource(res.response);
        
      },
      (error)=>{
        console.error(error)
      }
    )
  }

  dataSource3: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getdisabledallfeestructures(){
    this.feeStructureService.getDisabledFeestructures().subscribe(
      (res)=>{
        
        console.log("get disabled fee structures", res.response)
        this.dataSource3 = new MatTableDataSource(res.response);
        
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
      feeCategory: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      
     
    }) as FormGroup & FeeStructure; 
  }
  createForm1() {
    this.form1 = this.formBuilder.group({
     
    
      feeCategory: ['', [Validators.required]],
     
      
     
    }) as FormGroup ; 
  }


  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name:body.name,
      program: body.program,
      academicyear: body.academicyear._id,
      academicterm: body.academicterm._id,
 
      feeCategory: body.feeCategory._id,
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
  closeModal1() {
   
    this.clrModalOpen1 = false;
  }
  openModal1() {
    
    this.clrModalOpen1 = true;
  }
  onSubmit(){
    if(this.form.value){
      console.log('this.formModel.value : ', this.form.value);

     
      const feestruct={
        name:this.form.value.name,
        program : this.form.value.program,
        academicyear : this.form.value.academicyear,
        academicterm: this.form.value.academicterm,
        feeCategory: this.feeCatId,
        description: this.form.value.description,
        amount: this.form.value.amount,
    }
    
      
      
      if(this.modalType === 'add'){
        this.feeStructureService.createFeestructure(feestruct).subscribe(
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
        this.feeStructureService.editById(this.form.value._id,feestruct).subscribe(
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
    this.getallacademicterms()

    this.openModal('edit');
  }

  deletefeestructure(id:string){
    this.feeStructureService.deleteFeestructure(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getallfeestructures();
        this.getdisabledallfeestructures();

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
dataSource1: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();


addfeecategorytotable() {
  const feecat = {
    feeCategory: this.form1.value.feeCategory,
    name:''
  };
  this.feeCategoryService.getOneFeeCatgory(this.form1.value.feeCategory).subscribe(
    (res)=> {
      feecat.name = res.response.name
    }
  )
  
  this.feeCatId.push(this.form1.value.feeCategory);
  this.feecategorytotable.push(feecat);
  this.dataSource1 = new MatTableDataSource(this.feecategorytotable);
}


restore(id:string){
  this.feeStructureService.restore(id).subscribe(
    (res)=>{
      this.getallfeestructures();
      this.getdisabledallfeestructures()
    this.toasterService.success("restored successfully")
    
    
    },
    (err)=>{
      console.log("restore errror", err)
      this.toasterService.error('restore error');
    }
  )
}

}
