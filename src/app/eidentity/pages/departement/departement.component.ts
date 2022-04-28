import { Component, OnInit } from '@angular/core';
import { DepartementService } from '../../services/departement.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { getToken } from 'src/app/hr/helpers/getToken';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.css']
})
export class DepartementComponent implements OnInit {

  AddDep:any={
    name:"",
    company:""
  }
  pageName="Departements"
  displayedColumns: string[] = ['name','company','action'];
  departements:any
  company:any;
  user: any;
  constructor(private DepartementService:DepartementService,private MatDialog:MatDialog,private route: ActivatedRoute,private companyService:CompanyService,private ToasterService:ToasterService) { }
  id:any=this.route.snapshot.paramMap.get("id");    

  ngOnInit(): void {
    this.user=jwt_decode(getToken())
    console.log(this.id);
    if(this.id===null){
      this.getAlldeps()
    }
    else{
      this.getDepByCompanyId() 
      this.getCompanyName()
      
    }
     
     
  }

  getAlldeps(){
    this.DepartementService.getAlldeps().subscribe(res=>{
      this.departements=res['response']
      console.log(this.departements);
    })
  }

  openModal(templateRef,id){
    if(this.id===null){
      this.getCompanies()
    }
    this.MatDialog.open(templateRef)
}
closeModal(){
  this.MatDialog.ngOnDestroy()
}

  addDepartement(){
    if(this.id!=null){
      this.AddDep.company=this.company._id;
    }
        
        this.DepartementService.addDepartement(this.AddDep).subscribe(res=>{
                          console.log(this.AddDep)
                          this.MatDialog.closeAll()
                          this.ngOnInit()
                   })
         
  }
  
  deleteDepartement(){
    
  }
  getDepByCompanyId(){
    this.DepartementService.getByCompanyId(this.id).subscribe(res=>{
      this.departements=res['response']
      console.log(this.departements)
    })
  }

  getCompanyName(){
    this.companyService.getOneById(this.id).subscribe(res=>{
      this.company=res['response']
      this.pageName=res['response'].name
    })
  }

  getCompanies(){
    this.companyService.getCompanies().subscribe(res=>{
      this.company=res['response']
      console.log(this.company);
    })
  }
}


