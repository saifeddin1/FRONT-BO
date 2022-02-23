import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Niveau,
  NiveauMatiere,
  NiveauService,
} from '../../niveau/niveau.service';
import { MatPaginator } from '@angular/material/paginator';
import { SeanceNivMat, SeanceNivMatService } from './seance-nivmat.service';
import { Seance, SeanceService } from '../seance.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { ADMIN, INSTRUCTOR } from '../../../../constants/roles.constant';

@Component({
  selector: 'app-edit-seance-nivmat',
  templateUrl: './edit-seance-nivmat.component.html',
  styleUrls: ['./edit-seance-nivmat.component.css'],
})
export class EditSeanceNivmatComponent implements OnInit {
  clrModalOpen: boolean = false;
  paginatorOptions = {
    length: 100,
    pageSize: 5,
    currentPage: 0,
  };
  seanceId: string;
  nivId: string;
  constructor(
    private seanceNivMatService: SeanceNivMatService,
    private seanceService: SeanceService,
    private toasterService: ToasterService,
    private niveauService: NiveauService,
    private userService: UserService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.seanceId = this.activatedRouter.snapshot.params['seanceId'];
    this.nivId = this.activatedRouter.snapshot.params['nivId'];
    if (!this.seanceId || !this.nivId) this.router.navigate(['seances']);
    this.getSeance();
    this.getSeanceNivMats();
    this.getMatieres();
    this.getNiv();
  }

  canManage: boolean = false;
  canManageHomework: boolean = false;
  ngOnInit(): void {
    var user: User = this.userService.getCurrentUser();
    if (user.type === ADMIN) {
      this.canManage = true;
      this.canManageHomework = true;
    } else {
      if (user && user.type === INSTRUCTOR && user.permissions.seance) {
        this.canManage = true;
        if (user.permissions.homework) {
          this.canManageHomework = true;
        }
      }
    }
  }

  seance: Seance;
  getSeance() {
    this.seanceService.findById(this.seanceId).subscribe(
      (res: Seance) => {
        console.log('Niveaux : ', res);
        this.seance = res;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  niveau: Niveau;
  getNiv() {
    this.niveauService.findById(this.nivId).subscribe(
      (res: Niveau) => {
        console.log('niv : ', res);
        this.niveau = res;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  nivmatDataSource: MatTableDataSource<NiveauMatiere> =
    new MatTableDataSource<NiveauMatiere>();
  displayedNivMatColumns: string[] = ['name', 'action'];
  getMatieres() {
    this.niveauService.getAllMatieresById(this.nivId).subscribe(
      (res: [NiveauMatiere] | any) => {
        console.log('nivmats : ', res);
        res = res.map((x) => ({ ...x, name: x.matiere.name }));
        this.nivmatDataSource = new MatTableDataSource(res);
        this.nivmatDataSource.paginator = this.paginator;
        this.paginatorOptions.length = res.length;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.nivmatDataSource.filter = filterValue.trim().toLowerCase();
  }

  assignNiveau(nivMat: NiveauMatiere) {
    this.seanceNivMatService
      .create({
        seanceId: this.seanceId,
        niveauId: this.nivId,
        nivMatId: nivMat._id,
      })
      .subscribe(
        (res: SeanceNivMat) => {
          console.log('Assign Niveau : ', res);
          this.dataSource.data.push({ ...res, nivMatId: nivMat });
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.toasterService.success(DEFAULT_MESSAGES.success.add);
        },
        (error) => {
          console.error('error :', error);
          this.toasterService.error(DEFAULT_MESSAGES.error.default);
        }
      );
  }

  dataSource: MatTableDataSource<SeanceNivMat> =
    new MatTableDataSource<SeanceNivMat>();
  displayedColumns: string[] = ['name', 'action'];
  getSeanceNivMats() {
    this.seanceNivMatService
      .bySeanceIdNivId(this.seanceId, this.nivId)
      .subscribe(
        (res: SeanceNivMat[]) => {
          console.log('res : ', res);
          this.dataSource = new MatTableDataSource(res);
        },
        (error) => {
          console.error('error :', error);
        }
      );
  }
  deleteById(id, index) {
    this.seanceNivMatService.delete(id).subscribe(
      (res) => {
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        console.log('Seance Niveau Deleted Successfully');
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => {
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
        console.log(err);
      }
    );
  }
  openModal() {
    this.clrModalOpen = true;
  }
  closeModal() {
    this.clrModalOpen = false;
  }
}
