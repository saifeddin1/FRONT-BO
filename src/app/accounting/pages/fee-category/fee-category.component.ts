import { FeeCategory } from './../../models/feeCatgory.model';
import { FeeCategoryService } from './../../services/fee-category.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fee-category',
  templateUrl: './fee-category.component.html',
  styleUrls: ['./fee-category.component.css']
})
export class FeeCategoryComponent implements OnInit {

  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    '#',
    'name',
    'description',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService, private feeCategoryService:FeeCategoryService) {
    this.getallFeeCategory();
   }

  ngOnInit(): void {
    this.createForm();
  }

  dataSource: MatTableDataSource<FeeCategory> = new MatTableDataSource<FeeCategory>();
  getallFeeCategory(){
    this.feeCategoryService.getFeeCatgories().subscribe(
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
      description: ['', [Validators.required]],
      
      
     
    }) as FormGroup & FeeCategory; 
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      description: body.description,
     
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

     
      const feeCategory={
        name : this.form.value.name,
        description : this.form.value.description,
        

      }
      console.log("***********",this.form.value._id)
      
      if(this.modalType === 'add'){
        this.feeCategoryService.createFeeCategory(feeCategory).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.getallFeeCategory();
          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.feeCategoryService.editById(this.form.value._id,feeCategory).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.getallFeeCategory();
          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    }
  }

  editById(body: Partial<FeeCategory>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  deleteFeeCategory(id:string){
    this.feeCategoryService.deleteFeeCategory(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getallFeeCategory();
      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }


}
