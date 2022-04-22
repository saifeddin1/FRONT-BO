import { User } from 'src/app/eidentity/models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { UsersService } from '../../services/users.service';
import { UserService } from 'src/app/lms/services/user.service';
import { ResetpwdService } from '../../services/resetpwd.service';
import moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  newpass: string;
  emailchange:string;
  displayniv = false;
  studentnivs : object[] = [];
  clrModalOpen: boolean = false;
  clrModalOpen2: boolean = false;
  form: FormGroup;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  day = this.now.getDay();
  minDate = moment({year: this.year - 100, month: this.month, day: this.day}).format('YYYY-MM-DD');

  maxDate = moment({year: this.year - 18, month: this.month, day: this.day}).format('YYYY-MM-DD');
  displayedColumns : string[]=[
    '#',
    'username',
    'email',
    'type',
    'phone',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(private pwdService: ResetpwdService,private formBuilder: FormBuilder,private toasterService: ToasterService, private usersService:UsersService,private userServicelms:UserService ) 
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
        console.log("get all studentnivs",res)
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
      birthday:moment(body.birthday).format('YYYY-MM-DD'),
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
  closeModal2() {
    this.createForm();
    this.clrModalOpen2 = false;
    
  }

  onSubmit(){
    if(this.form.value){
      console.log('this.formModel.value : ', this.form.value);
      
      let user ;
     
      if (this.form.value.username.length < 5) {
    
        this.toasterService.error("username doit contenir au moins 5 caractères");
        return;
      }
      if (this.form.value.firstname.length < 3) {
        this.toasterService.error("firstname doit contenir au moins 3 caractères");
        return;
      }
      if (this.form.value.lastname.length < 3) {
        this.toasterService.error("lastname doit contenir au moins 3 caractères");
        return;
      }
      if( this.form.value.type =='ESTUDENT'){
        user={
          username : this.form.value.username,
          firstname : this.form.value.firstname,
          lastname: this.form.value.lastname,
          type: this.form.value.type,
        
          email: this.form.value.email,
          studentNiveauId:this.form.value.studentNiveauId,
          birthday:this.form.value.birthday
  
        }

      }else{
        user={
          username : this.form.value.username,
          firstname : this.form.value.firstname,
          lastname: this.form.value.lastname,
          type: this.form.value.type,
        
          email: this.form.value.email,
         
          birthday:this.form.value.birthday
  
        }
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

  activatestudentniv(){
    this.form.value.type == 'ESTUDENT' ? this.displayniv = true : this.displayniv = false
  }

  openchangepwdmodal(email:string){
    this.emailchange=email;
    this.clrModalOpen2 = true;
    
  }
  changepwd(){
    
    this.pwdService.changepwdbyadmin(this.emailchange,{newpassword:this.newpass}).subscribe(
      (res)=>{
        this.toasterService.success("Changed successfully")
        
      },
      (err)=>{
        this.toasterService.error('Something wrong')
        
      }
    )
  }
}
