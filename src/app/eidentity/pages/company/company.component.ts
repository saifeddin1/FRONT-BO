import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { Company as company } from '../../models/compant.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
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
}
  displayedColumns: string[] = ['name','adress','action'];
  constructor(private companyService:CompanyService, private matDialog:MatDialog) { }
  companies:any;

  ngOnInit(): void {
    this.getAll()
  }

  getAll(){
    this.companyService.getCompanies().subscribe(res=>{
        this.companies=res['response']
        console.log(this.companies);
    })
  }

  openModal(templateRef,id){
    // this.id=id
    this.matDialog.open(templateRef)
}

  closeModal(){
    this.matDialog.ngOnDestroy()
  }

}
