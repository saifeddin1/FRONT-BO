import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Niveau, NiveauService } from '../../niveau/niveau.service';
import { MatPaginator } from '@angular/material/paginator';
import { InstructorNiv, InstructorNivService } from './instructor-niv.service';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';

@Component({
  selector: 'app-edit-instructor-niveau',
  templateUrl: './edit-instructor-niveau.component.html',
  styleUrls: ['./edit-instructor-niveau.component.css'],
})
export class EditInstructorNiveauComponent {
  clrModalOpen: boolean = false;
  paginatorOptions = {
    length: 100,
    pageSize: 5,
    currentPage: 0,
  };

  userId: string;
  user;
  constructor(
    private instructorNivService: InstructorNivService,
    private userService: UserService,
    private niveauService: NiveauService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder
  ) {
    this.userId = this.activatedRouter.snapshot.params['userId'];
    if (!this.userId) this.router.navigate(['instructors']);
    this.getUserById();
    this.getInstructorNiveaux();
    this.getNiveaux();
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

  assignNiveau(niveau: Niveau) {
    this.instructorNivService
      .create({ userId: this.userId, niveauId: niveau._id })
      .subscribe(
        (res: InstructorNiv) => {
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

  dataSource: MatTableDataSource<InstructorNiv> =
    new MatTableDataSource<InstructorNiv>();
  displayedColumns: string[] = ['name', 'action'];
  getInstructorNiveaux() {
    this.instructorNivService.findByUserId(this.userId).subscribe(
      (res: InstructorNiv[]) => {
        console.log('res : ', res);
        this.dataSource = new MatTableDataSource(res);
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  goToInsTructorNiveauMatieres(niveauId: string): void {
    this.router.navigate(['instructors/edit/nivmat', this.userId, niveauId]);
  }

  deleteById(id, index) {
    this.instructorNivService.delete(id).subscribe(
      (res) => {
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        console.log('Instructor Niveau Deleted Successfully');
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => console.log(err)
    );
  }

  openModal() {
    this.clrModalOpen = true;
  }
  closeModal() {
    this.clrModalOpen = false;
  }
}
