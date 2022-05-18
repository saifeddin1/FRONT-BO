import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Niveau, NiveauService } from '../../niveau/niveau.service';
import { MatPaginator } from '@angular/material/paginator';
import { SeanceNiv, SeanceNivService } from './seance-niv.service';
import { Seance, SeanceService } from '../seance.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { ADMIN, INSTRUCTOR } from '../../../../constants/roles.constant';

@Component({
  selector: 'app-edit-seance-niveau',
  templateUrl: './edit-seance-niveau.component.html',
  styleUrls: ['./edit-seance-niveau.component.css'],
})
export class EditSeanceNiveauComponent {
  clrModalOpen: boolean = false;
  paginatorOptions = {
    length: 100,
    pageSize: 5,
    currentPage: 0,
  };

  seanceId: string;
  constructor(
    private toasterService: ToasterService,
    private seanceNivService: SeanceNivService,
    private niveauService: NiveauService,
    private seanceService: SeanceService,
    private userService: UserService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.seanceId = this.activatedRouter.snapshot.params['seanceId'];
    if (!this.seanceId) this.router.navigate(['instructors']);
    this.getSeance();
    this.getSeanceNiveaux();
    this.getNiveaux();
  }

  canManage: boolean = false;
  canManageHomework: boolean = false;
  ngOnInit(): void {
    var user: User = this.userService.getCurrentUser();
    if (user.type === ADMIN || INSTRUCTOR) {
      this.canManage = true;
      this.canManageHomework = true;
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  niveauDataSource: MatTableDataSource<Niveau> =
    new MatTableDataSource<Niveau>();
  displayedNiveauColumns: string[] = ['name', 'action'];
  getNiveaux() {
    this.niveauService.getAll().subscribe(
      (res: [Niveau]) => {
        console.log('Niveaux : ', res);
        this.niveauDataSource = new MatTableDataSource(res);
        this.niveauDataSource.paginator = this.paginator;
        this.paginatorOptions.length = res.length;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.niveauDataSource.filter = filterValue.trim().toLowerCase();
  }

  assignNiveau(niveau: Niveau) {
    this.seanceNivService
      .create({ seanceId: this.seanceId, niveauId: niveau._id })
      .subscribe(
        (res: SeanceNiv) => {
          console.log('Assign Niveau : ', res);
          this.dataSource.data.push({ ...res, niveauId: niveau });
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.toasterService.success(DEFAULT_MESSAGES.success.add);
        },
        (error) => {
          console.error('error :', error);
          this.toasterService.error(DEFAULT_MESSAGES.error.default);
        }
      );
  }

  dataSource: MatTableDataSource<SeanceNiv> =
    new MatTableDataSource<SeanceNiv>();
  displayedColumns: string[] = ['name', 'action'];
  getSeanceNiveaux() {
    this.seanceNivService.findBySeanceId(this.seanceId).subscribe(
      (res: SeanceNiv[]) => {
        console.log('res : ', res);
        this.dataSource = new MatTableDataSource(res);
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  goToSeanceNiveauMatieres(niveauId: string): void {
    this.router.navigateByUrl(
      `lms/seances/edit/nivmat/${this.seanceId}/${niveauId}`
    );
    // this.router.navigate(['seances/edit/nivmat', this.seanceId, niveauId]);
  }

  deleteById(id, index) {
    this.seanceNivService.delete(id).subscribe(
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
