import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vc-profile',
  templateUrl: './vc-profile.component.html',
  styleUrls: ['./vc-profile.component.css']
})
export class VcProfileComponent implements OnInit {
  disabled:any=""
  constructor() { }

  ngOnInit(): void {
  }

  enableEdit(){
    this.disabled="false"
  }
  createe(){
    console.log(this.disabled)
  }

}
