import { Academicyear } from './../../models/acadmicyear.model';
import { FeeStructure } from './../../models/feeStructure.model';
import { FeestructureService } from './../../services/feestructure.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-feestructure',
  templateUrl: './feestructure.component.html',
  styleUrls: ['./feestructure.component.css']
})
export class FeestructureComponent implements OnInit {

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
 

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService, private feeStructureService: FeestructureService) {
    this.getallfeestructures();
   }

  ngOnInit(): void {
    this.createForm();
  }

  
  dataSource: MatTableDataSource<FeeStructure> = new MatTableDataSource<FeeStructure>();
  getallfeestructures(){
    this.feeStructureService.getFeestructures().subscribe(
      (res)=>{
        this.dataSource = new MatTableDataSource(res.response);
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

}
