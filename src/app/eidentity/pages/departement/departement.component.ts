import { Component, OnInit } from '@angular/core';
import { DepartementService } from '../../services/departement.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.css']
})
export class DepartementComponent implements OnInit {
  displayedColumns: string[] = ['name','company','action'];
  departements:any
  constructor(private DepartementService:DepartementService,private MatDialog:MatDialog) { }

  ngOnInit(): void {
    this.getAlldeps()
  }

  getAlldeps(){
    this.DepartementService.getAlldeps().subscribe(res=>{
      this.departements=res['response']
      console.log(this.departements);
    })
  }

  openModal(templateRef,id){
    // this.id=id
    this.MatDialog.open(templateRef)
}
closeModal(){
  this.MatDialog.ngOnDestroy()
}

  addDepartement(){
    
  }
  
  deleteDepartement(){
    
  }

}
