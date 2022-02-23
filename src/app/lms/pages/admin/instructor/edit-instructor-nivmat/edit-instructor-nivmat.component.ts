import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Niveau,
  NiveauMatiere,
  NiveauService,
} from '../../../admin/niveau/niveau.service';
import { MatPaginator } from '@angular/material/paginator';
import {
  InstructorNivMat,
  InstructorNivMatService,
} from './instructor-nivmat.service';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';

@Component({
  selector: 'app-edit-instructor-nivmat',
  templateUrl: './edit-instructor-nivmat.component.html',
  styleUrls: ['./edit-instructor-nivmat.component.css'],
})
export class EditInstructorNivmatComponent {
  clrModalOpen: boolean = false;
  paginatorOptions = {
    length: 100,
    pageSize: 5,
    currentPage: 0,
  };

  userId: string;
  nivId: string;
  user;
  constructor(
    private instructorNivMatService: InstructorNivMatService,
    private toasterService: ToasterService,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private niveauService: NiveauService,
    private router: Router
  ) {
    this.userId = this.activatedRouter.snapshot.params['userId'];
    this.nivId = this.activatedRouter.snapshot.params['nivId'];
    if (!this.userId || !this.nivId) this.router.navigate(['instructors']);
    this.getUserById();
    this.getInstructorNivMats();
    this.getMatieres();
    this.getNiv();
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

  getUserById() {
    this.userService.getUserById(this.userId).subscribe(
      (user: User) => {
        console.log('user : ', user);
        this.user = user;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  assignNiveau(nivMat: NiveauMatiere) {
    this.instructorNivMatService
      .create({
        userId: this.userId,
        niveauId: this.nivId,
        nivMatId: nivMat._id,
      })
      .subscribe(
        (res: InstructorNivMat) => {
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

  dataSource: MatTableDataSource<InstructorNivMat> =
    new MatTableDataSource<InstructorNivMat>();
  displayedColumns: string[] = ['name', 'action'];
  getInstructorNivMats() {
    this.instructorNivMatService
      .byUserIdNivId(this.userId, this.nivId)
      .subscribe(
        (res: InstructorNivMat[]) => {
          console.log('res : ', res);
          this.dataSource = new MatTableDataSource(res);
        },
        (error) => {
          console.error('error :', error);
        }
      );
  }

  goToInsTructornivmats(niveauId: string): void {
    this.router.navigate(['instructors/edit/nivmat', this.userId, niveauId]);
  }

  deleteById(id, index) {
    this.instructorNivMatService.delete(id).subscribe(
      (res) => {
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        console.log('Instructor Niveau Deleted Successfully');
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => {
        console.log(err);
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
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
