import { User } from 'src/app/eidentity/models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  studentnivs : object[] = [];
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns : string[]=[
    '#',
    'username',
    'email',
    'type',
    'phone',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(private formBuilder: FormBuilder,private toasterService: ToasterService, private usersService:UsersService ) 
  {
    this.getallUsers();
    this.getstudentniv();
   }

  ngOnInit(): void {
    this.createForm()
  }

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  getstudentniv(){
    this.usersService.getStudetNiv().subscribe(
      (res)=>{
        this.studentnivs = res;
      },
      (error)=>{
        console.error(error)
      }
    )

    

  }
  getallUsers(){
    this.usersService.getUsers().subscribe(
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
      username: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      type: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      studentNiveauId: ['', [Validators.required]],
      
     
    }) as FormGroup & User; 
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      password: body.password,
      email: body.email,
      type: body.type,
      birthday: body.birthday,
      studentNiveauId: body.studentNiveauId,
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

     
      const user={
        username : this.form.value.username,
        firstname : this.form.value.firstname,
        lastname: this.form.value.lastname,
        type: this.form.value.type,
        password: this.form.value.password,
        email: this.form.value.email,
        studentNiveauId:this.form.value.studentNiveauId,
        birthday:this.form.value.birthday

      }
      
      if(this.modalType === 'add'){
        this.usersService.createUser(user).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.getallUsers();

          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.usersService.updateUser(this.form.value._id,user).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.getallUsers();

          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }

      
    }
  }

  activateUser(id:string){

    this.usersService.activateUser(id).subscribe(
      (result)=>{
        console.log('Activated successfully:',result);
        this.toasterService.success('Activated Successfully');
        this.getallUsers();

      },(err)=>{
        console.log(err)
        this.toasterService.error('Something wrong')
      }

    )
  }

  editById(body: Partial<User>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  deleteProgram(id:string){
    this.usersService.deleteUser(id).subscribe(
      (res)=>{
        this.toasterService.success("Deleted successfully")
        this.getallUsers();

      },
      (err)=>{
        this.toasterService.error('Something wrong ')
      }
    )
  }

}
