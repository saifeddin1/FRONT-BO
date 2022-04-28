import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Academicyear } from '../../models/acadmicyear.model';
import { AcademicyearService } from '../../services/academicyear.service';

@Component({
  selector: 'app-academicyear',
  templateUrl: './academicyear.component.html',
  styleUrls: ['./academicyear.component.css']
})
export class AcademicyearComponent implements OnInit {

  clrModalOpen: boolean = false;
  clrModalOpen1: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
 
    'name',
    'startyear',
    'endyear' ,
    'action'
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService, private academicyearService:AcademicyearService) { 
    this.getallAcademicyear()
    this.getallDisabledAcademicyear();
  }

  ngOnInit(): void {
    this.createForm();
  }

  dataSource: MatTableDataSource<Academicyear> = new MatTableDataSource<Academicyear>();
  getallAcademicyear(){
    this.academicyearService.getAcademicyears().subscribe(
      (res)=>{
        this.dataSource = new MatTableDataSource(res.response);
      },
      (error)=>{
        console.error(error)
      }
    )
  }
  dataSource1: MatTableDataSource<Academicyear> = new MatTableDataSource<Academicyear>();
  getallDisabledAcademicyear(){
    this.academicyearService.getDisabledAcademicyears().subscribe(
      (res)=>{
        this.dataSource1 = new MatTableDataSource(res.response);
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
      startyear: ['', [Validators.required]],
      endyear: ['', [Validators.required]],
      
      
     
    }) as FormGroup & Academicyear; 
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
     startyear: moment(body.startyear).format('YYYY-MM-DD'),
     endyear:moment(body.endyear).format('YYYY-MM-DD')
     
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

     
      const academicyear={
        name : this.form.value.name,
        startyear : this.form.value.startyear,
        endyear : this.form.value.endyear,
        

      }
      console.log("***********",this.form.value._id)
      
      if(this.modalType === 'add'){
        this.academicyearService.createAcademicyear(academicyear).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.getallAcademicyear()
            this.closeModal()
          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.academicyearService.editById(this.form.value._id,academicyear).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.getallAcademicyear();
            this.closeModal();
          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    }
  }

  editById(body: Partial<Academicyear>) {
    
    this.fillFormModel(body);
    this.openModal('edit');
  }

  delete(id:string){
    this.academicyearService.deleteAcademicyear(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getallAcademicyear()
        this.getallDisabledAcademicyear();
      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }


  restore(id:string){
    this.academicyearService.restore(id).subscribe(
      (res)=>{
      this.toasterService.success("restored successfully")
      this.getallAcademicyear()
      this.getallDisabledAcademicyear();
      },
      (err)=>{
        console.log("restore errror", err)
        this.toasterService.error('restore error');
      }
    )
  }


}
