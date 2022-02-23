import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import {
  NiveauMatiere,
  NiveauService,
} from '../../../../pages/admin/niveau/niveau.service';
import { Matiere } from '../../../../pages/admin/matiere/matiere.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  @Input() nivMat: any;
  nivMatId: string = '';

  constructor(
    private router: Router,
    private niveauService: NiveauService,
    private activatedRouter: ActivatedRoute,
    private _location: Location,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.params.subscribe((routeParams) => {
      this.nivMatId = routeParams.nivMatId;
      this.getSeeMoreMatiere();
      // this.getCoursesCount();
    });
  }

  // coursesCount: number = 0
  // getCoursesCount() {
  //   this.courseService
  //     .getCoursesCountForStudents(this.userService.user.studentNiveauId, this.nivMatId)
  //     .subscribe((res: number) => {
  //       console.log("res :", res);
  //       this.coursesCount = res
  //     }, err => {
  //       console.log("err :", err);
  //     });
  // }

  otherMatieresList: any = [];
  getSeeMoreMatiere(limit = 3) {
    this.niveauService
      .getSeeMoreByNiveauId(
        this.userService.user.studentNiveauId,
        this.nivMatId,
        limit
      )
      .subscribe(
        (otherMatieresList: any) => {
          this.otherMatieresList = otherMatieresList;
          console.log('otherMatieresList :', otherMatieresList);
          if (otherMatieresList && otherMatieresList.length) {
            otherMatieresList.forEach((nivMat) => {
              this.getImage(nivMat);
            });
          }
        },
        (err) => {
          console.error(err);
          this._location.back();
        }
      );
  }

  goToMatieresList() {
    this.router.navigate([`matieres/`]);
  }

  goToMatiere(matiereId) {
    this.router.navigate([`matiere/details/${matiereId}`]);
  }

  getImage(nivMat) {
    if (nivMat && nivMat.matiere && nivMat.matiere.img)
      nivMat.matiere.img = `${environment.LmsApiUrl}/api/matiere/documents/${nivMat.matiere.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
  }
}
