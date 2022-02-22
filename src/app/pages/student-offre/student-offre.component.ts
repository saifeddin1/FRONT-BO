import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { Offre, OffreService } from '../admin/offre/offre.service';

@Component({
  selector: 'app-student-offre',
  templateUrl: './student-offre.component.html',
  styleUrls: ['./student-offre.component.css']
})
export class StudentOffreComponent implements OnInit {

  constructor(
    private offreService: OffreService,
    private userService: UserService
  ) {
    this.getOffres()
  }

  ngOnInit(): void {
  }

  offres;
  getOffres() {
    this.offreService.getAll()
      .subscribe((res: [Offre]) => {
        console.log("res : ", res)
        this.offres = res
        if (res && res.length) {
          this.offres.forEach((offre) => {
            if (offre.img) {
              offre.img = `${environment.LmsApiUrl}/api/offre/documents/${offre.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
            }
          });
        }
      }, error => {
        console.error("error : ", error)
      })
  }

}
