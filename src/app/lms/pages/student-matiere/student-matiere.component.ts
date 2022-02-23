import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { Matiere, MatiereService } from '../admin/matiere/matiere.service';
import { NiveauMatiere, NiveauService } from '../admin/niveau/niveau.service';
import { ImageService } from '../../services/image.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-student-matiere',
  templateUrl: './student-matiere.component.html',
  styleUrls: ['./student-matiere.component.css']
})
export class StudentMatiereComponent implements OnInit {
  constructor(
    private userService: UserService,
    private imageService: ImageService,
    private router: Router,
    private niveauService: NiveauService
  ) { }
  phoneNumber =  "+21622033557" 
  ngOnInit(): void {
    this.ngOnChanges();
  }

  nivMats: any;
  ngOnChanges(): void {
    var id: string
    const StNiv = this.userService.user.studentNiveauId
    if (StNiv) {
      switch (typeof StNiv) {
        case "string":
          id = StNiv
          break;
        case "object":
          id = StNiv._id
          break;
      }
      if (id) {
        this.niveauService.getAllMatieresById(id)
          .subscribe(res => {
            console.log("this.matieres :", res);
            this.nivMats = res
            this.getImages(res)

          }, err => {
            console.error(err);
          });
      }
    }
  }

  getImages(res) {
    res.forEach((nivMat: NiveauMatiere) => {
      if (nivMat && nivMat.matiere && nivMat.matiere.img)
        nivMat.matiere.img = `${environment.LmsApiUrl}/api/matiere/documents/${nivMat.matiere.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
    });
  }

  // selectedMatiere: any;
  previewMatiere(event): void {
    // this.selectedMatiere = $event;
    this.router.navigate([`matiere/details/${event._id}`]);
  }

}
