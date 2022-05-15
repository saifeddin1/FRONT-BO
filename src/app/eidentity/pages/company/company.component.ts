import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { Company } from '../../models/company.model';
import { getToken } from 'src/app/hr/helpers/getToken';
import jwt_decode from 'jwt-decode';
import { DepartementService } from '../../services/departement.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  clrModalOpen: boolean = false;
  form: FormGroup;
  id:any;
  user:any
  legalstatus:any=[{value:"Verified"},{value:"Not verified"}]
  enabled:any=[{value:"Enabled",boolean:"true"},{value:"Not enabled",boolean:"false"}]
  departement={
    nom:"",
    company:""
  }

//   company={
//     name: "",
//     address:"",
//     phone: 0,
//     type:"",
//     email:"",
//     legalStatus: "",
//     tvaic: "",
//     siret: "",
//     rcs:"",
//     codeApe: "",
//     website: "", 
//     imageUrl: "String", 
//     employeesCount:0,
//     enabled: false,
//     owner:""
// }
  modalType: string = 'add';
  displayedColumns: string[] = ['name','adress','action'];
  constructor(private companyService:CompanyService, private depService:DepartementService,private matDialog:MatDialog,private router:Router,
              private formBuilder: FormBuilder, private toasterService:ToastrService
              ) { }
  companies:any;

  ngOnInit(): void {
    // this.getAll()
    this.createForm()
    this.user=jwt_decode(getToken())

    // if(this.user.type==="EOO"){
    //   console.log(this.user.company);
    //   this.getByOnwer(this.user.company)
    // }
    // else{
      console.log(this.user.company);
      this.getAll()
    // }
    
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      address:['', [Validators.required]],
      phone: ['', [Validators.required]],
      type:['', [Validators.required]],
      email:['', [Validators.required]],
      legalStatus: ['', [Validators.required]],
      tvaic: ['', [Validators.required]],
      siret: ['', [Validators.required]],
      rcs:['', [Validators.required]],
      codeApe: ['', [Validators.required]],
      website: ['', [Validators.required]], 
      imageUrl: ['', [Validators.required]], 
      employeesCount:['', [Validators.required]],
      enabled: ['', [Validators.required]],
      
     
    }) as FormGroup & Company; 
  }

  fillFormModel(body) {
    
    // for(let i=0;i<this.accessModules.length;i++){
    //   if(this.accessModules[i].isChecked===true){
    //     this.checkedAccessModules.push(this.accessModules[i].module)
    //   }
    // }
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      address: body.address,
      phone: body.phone,
      type: body.type,
      email: body.email,
      legalStatus: body.legalStatus,
      tvaic: body.tvaic,
      siret: body.siret,
      rcs: body.rcs,
      codeApe: body.codeApe,
      website: body.website, 
      imageUrl: body.imageUrl, 
      employeesCount: body.employeesCount,
      enabled: body.enabled,
    });
  }

  getAll(){
    this.companyService.getCompanies().subscribe(res=>{
        this.companies=res['response']
        console.log(this.companies);
    })
  }

//   openModal(templateRef,id){
//     this.id=id
//     this.matDialog.open(templateRef)
// }

editById(body: Partial<Company>) {
  this.fillFormModel(body);
  this.openModal('edit');
}

openModal(type ='add') {
  this.clrModalOpen = true;
  if (type == 'add') {
    this.modalType = 'add';
    this.createForm();
  } else {
    this.modalType = 'edit';
  }
  this.getAll()
}

  // closeModal(){
  //   this.matDialog.ngOnDestroy()
  // }
  
  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
    
  }

  // addNewCompany(){
  //   this.company.owner=this.user._id
  //   this.companyService.addCompany(this.company).subscribe(res=>{
  //     this.ngOnInit()
  //   })   
  // }

  deleteCompany(){
    this.companyService.deleteCompany(this.id).subscribe(res=>{
      this.ngOnInit()
      this.closeModal()
    })
  }

  addDepartement(){
    this.departement.company=this.id
    this.depService.addDepartement(this.departement).subscribe(res=>{
      this.ngOnInit()
      this.matDialog.ngOnDestroy()
    })   
  }

  getByOnwer(id:any){
    this.companyService.geByowner(id).subscribe(res=>{
      this.companies=res['response']
      console.log(this.companies);
    })
  }
  onSubmit(){
    if(this.form.value){
      console.log('this.formModel.value : ', this.form.value);
      
      let company ;
     
      // if (this.form.value.username.length < 5) {
    
      //   this.toasterService.error("username doit contenir au moins 5 caractères");
      //   return;
      // }
      // if (this.form.value.firstname.length < 3) {
      //   this.toasterService.error("firstname doit contenir au moins 3 caractères");
      //   return;
      // }
      // if (this.form.value.lastname.length < 3) {
      //   this.toasterService.error("lastname doit contenir au moins 3 caractères");
      //   return;
      // }
      // if( this.form.value.type =='ESTUDENT'){
      //   user={
      //     username : this.form.value.username,
      //     firstname : this.form.value.firstname,
      //     lastname: this.form.value.lastname,
      //     type: this.form.value.type,        
      //     email: this.form.value.email,
      //     studentNiveauId:this.form.value.studentNiveauId,
      //     birthday:this.form.value.birthday
  
      //   }

      // }
      // else if( this.form.value.type =='EOO'){

        company={
          name: this.form.value.name,
          address:this.form.value.address,
          phone: this.form.value.phone,
          type:this.form.value.type,
          email:this.form.value.email,
          legalStatus: this.form.value.legalStatus,
          tvaic: this.form.value.tvaic,
          siret:this.form.value.siret,
          rcs:this.form.value.rcs,
          codeApe: this.form.value.codeApe,
          website: this.form.value.website, 
          imageUrl: this.form.value.imageUrl, 
          employeesCount:this.form.value.employeesCount,
          enabled: this.form.value.enabled,
         }
  
        // }
      //   else{
      //   user={
      //     username : this.form.value.username,
      //     firstname : this.form.value.firstname,
      //     lastname: this.form.value.lastname,
      //     type: this.form.value.type,
        
      //     email: this.form.value.email,
         
      //     birthday:this.form.value.birthday
  
      //   }
      // }
      
     
      
      if(this.modalType === 'add'){
        

        
        this.companyService.addCompany(company).subscribe(
          (result)=>{
            
            console.log(result)
            this.toasterService.success("Created successfully")
            this.getAll();

          },
          (err)=>{
            console.log(err)
            this.toasterService.error('Something wrong ')
          })
      }else if(this.modalType === 'edit'){
        this.companyService.editcompany(this.form.value._id,company).subscribe(
          (result)=>{
            console.log('edited successfully:',result);
            this.toasterService.success('Edited Successfully');
            this.getAll();

          },(err)=>{
            console.log(err)
            this.toasterService.error('Something wrong')
          }
        )
      }

      
    }
  }

 

}
