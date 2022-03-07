import { Program } from './../../models/program.model';
import { ProgramService } from './../../services/program.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {
  
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    '#',
    'name',
    'abreviation',
    'departement',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];
  constructor( private formBuilder: FormBuilder,private toasterService: ToasterService, private programService: ProgramService) { 
    this.getallprograms()
  }

  ngOnInit(): void {
    this.createForm();
    console.log(this.dataSource)
  }

  dataSource: MatTableDataSource<Program> = new MatTableDataSource<Program>();
  getallprograms(){
    this.programService.getPrograms().subscribe(
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
      abreviation: ['', [Validators.required]],
      departement: ['', [Validators.required]],
      
     
    }) as FormGroup & Program; 
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      departement: body.departement,
      abreviation: body.abreviation,
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
        name : this.form.value.name,
        departement : this.form.value.departement,
        abreviation: this.form.value.abreviation

      }
      console.log("***********",this.form.value._id)
      
      if(this.modalType === 'add'){
        this.programService.createProgram(program).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.getallprograms()
          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.programService.editById(this.form.value._id,program).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.getallprograms()
          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }
    }
  }
  editById(body: Partial<Program>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  deleteProgram(id:string){
    this.programService.deleteProgram(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getallprograms()
      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }

}
