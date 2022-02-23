import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { NivMatChapitreService } from '../../admin/niveau/nivMatChapitre.service';
import { Matiere } from '../../admin/matiere/matiere.service';
import {
  NiveauMatiere,
  NiveauService,
} from '../../admin/niveau/niveau.service';

@Component({
  selector: 'app-matiere-details',
  templateUrl: './matiere-details.component.html',
  styleUrls: ['./matiere-details.component.css'],
})
export class MatiereDetailsComponent implements OnInit {
  constructor(
    private nivMatChapitreService: NivMatChapitreService,
    private activatedRouter: ActivatedRoute,
    private _location: Location,
    private niveauService: NiveauService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((routeParams) => {
      this.nivMatId = routeParams.nivMatId;
      this.getChapitresByNivMatId();
    });
  }

  matiere: Matiere;
  getMatiere() {
    this.niveauService.getMatiereByNivMatId(this.nivMatId).subscribe(
      (res: NiveauMatiere) => {
        console.log('res :', res);
        if (res) this.getImage(res);
        this.nivMat = {
          chapitres: [],
          matiere: res.matiere,
        };
      },
      (err) => {
        console.log('err :', err);
      }
    );
  }

  nivMatId: string = '';
  nivMat: any;
  getChapitresByNivMatId() {
    if (!this.nivMatId) this._location.back();
    this.nivMatChapitreService
      .getChapitresByNivMatId(
        this.userService.user.studentNiveauId,
        this.nivMatId
      )
      .subscribe(
        (nivMat: any) => {
          if (nivMat) {
            nivMat.chapitres = nivMat.chapitres.sort(
              (a, b) => a.order - b.order
            );
            this.nivMat = nivMat;
            console.log('this.nivMat :', nivMat);
            this.getImage(nivMat);
          } else {
            console.log("Cette matière n'a pas de chapitres.");
            this.getMatiere();
            // this._location.back();
          }
        },
        (err) => {
          console.error(err);
          this._location.back();
        }
      );
  }
  getImage(nivMat) {
    if (nivMat.matiere.img)
      nivMat.matiere.img = `${environment.LmsApiUrl}/api/matiere/documents/${nivMat.matiere.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
  }
}
