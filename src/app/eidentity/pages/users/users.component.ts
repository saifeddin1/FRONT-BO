import { User } from 'src/app/eidentity/models/user.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { UsersService } from '../../services/users.service';
import { UserService } from 'src/app/lms/services/user.service';
import { ResetpwdService } from '../../services/resetpwd.service';
import moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';

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
  clrModalOpen1: boolean = false;
  clrModalOpen2: boolean = false;
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  form: FormGroup;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  day = this.now.getDay();
  minDate = moment({year: this.year - 100, month: this.month, day: this.day}).format('YYYY-MM-DD');

  maxDate = moment({year: this.year - 18, month: this.month, day: this.day}).format('YYYY-MM-DD');
  displayedColumns : string[]=[
    
    'username',
    'email',
    'type',
    'phone',
    'action' 
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(
    private pwdService: ResetpwdService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private usersService:UsersService,
    private userServicelms:UserService ) 
  {
    this.getallUsers();
    this.getstudentniv();
   }

  ngOnInit(): void {
    this.createForm()
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.getallUsers();

  }

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  dataSource1: MatTableDataSource<User> = new MatTableDataSource<User>();

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
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.p;
          this.paginator.length =
            res.response.length || 0;
        });
      
        this.total = res.response.length || 0;
      },
      (error)=>{
        console.error(error)
      }
    )
  }
  getallDisableStudents(){
    this.usersService.getDisableStudents().subscribe(
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
  closeModal1() {
    
    this.clrModalOpen1 = false;
    
  }
  openModal1() {
    
    this.clrModalOpen1 = true;
    
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
        this.getallDisableStudents();

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

  restore(id:string){
    this.usersService.restore(id).subscribe(
      (res)=>{
      this.toasterService.success("restored successfully")
      this.getallDisableStudents()
      this.getallUsers();
      },
      (err)=>{
        console.log("restore errror", err)
        this.toasterService.error('restore error');
      }
    )
  }

}
