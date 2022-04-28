import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { Company as company } from '../../models/company.model';
import { getToken } from 'src/app/hr/helpers/getToken';
import jwt_decode from 'jwt-decode';
import { DepartementService } from '../../services/departement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  id:any;
  user:any
  departement={
    nom:"",
    company:""
  }

  company={
    name: "",
    address:"",
    phone: 0,
    type:"",
    email:"",
    legalStatus: "",
    tvaic: "",
    siret: "",
    rcs:"",
    codeApe: "",
    website: "", 
    imageUrl: "String", 
    employeesCount:0,
    enabled: false,
    owner:""
}
  displayedColumns: string[] = ['name','adress','action'];
  constructor(private companyService:CompanyService, private depService:DepartementService,private matDialog:MatDialog,private router:Router) { }
  companies:any;

  ngOnInit(): void {
    // this.getAll()
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

  getAll(){
    this.companyService.getCompanies().subscribe(res=>{
        this.companies=res['response']
        console.log(this.companies);
    })
  }

  openModal(templateRef,id){
    this.id=id
    this.matDialog.open(templateRef)
}

  closeModal(){
    this.matDialog.ngOnDestroy()
  }

  addNewCompany(){
    this.company.owner=this.user._id
    this.companyService.addCompany(this.company).subscribe(res=>{
      this.ngOnInit()
    })   
  }

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

 

}
