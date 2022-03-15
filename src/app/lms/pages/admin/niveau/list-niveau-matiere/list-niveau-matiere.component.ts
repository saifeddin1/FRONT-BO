import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NiveauMatiere,
  NiveauService,
  NiveauWithMatiere,
} from '../niveau.service';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Matiere, MatiereService } from '../../matiere/matiere.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { ADMIN } from '../../../../constants/roles.constant';

@Component({
  selector: 'app-list-niveau-matiere',
  templateUrl: './list-niveau-matiere.component.html',
  styleUrls: ['./list-niveau-matiere.component.css'],
})
export class ListNiveauMatiereComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  form: FormGroup & NiveauMatiere;
  displayedNivMatsColumns: string[] = [
    'name',
    'userId',
    'locked',
    'enabled',
    'action',
  ];

  createForm() {
    const mat = this.matieresListAvailable.length
      ? this.matieresListAvailable[0]._id
      : '';
    this.form = this.formBuilder.group({
      _id: '',
      matiere: [mat, [Validators.required]],
      userId: [''],
      niveau: [this.nivId, [Validators.required]],
      locked: [false, [Validators.required]],
      enabled: [true, [Validators.required]],
    }) as FormGroup & NiveauMatiere;
  }
  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0,
  };
  constructor(
    private matiereService: MatiereService,
    private niveauService: NiveauService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private _location: Location,
    private router: Router
  ) {
    this.nivId = this.activatedRouter.snapshot.params['id'];
    if (!this.nivId) this._location.back();
    this.getNiveauWithMatiere();
    this.createForm();
    this.getAllMatiere();
    this.getAllInstructorsNames();
  }
  instructors: { _id: string; profile: { fullname: string } }[] = [];
  instructorsNames: string[] = [];
  getAllInstructorsNames() {
    this.userService.getAllInstructorsNames().subscribe(
      (res) => {
        console.log('Users : ', res);
        if (res && res.length) {
          this.instructors = res;
          this.instructorsNames = res.reduce(
            (a, v) => ({ ...a, [v._id]: v.name }),
            {}
          );
        }
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  getInstuctorName = (instructorId) =>
    instructorId ? this.instructorsNames[instructorId] : "Pas d'instructeur";

  canManage: boolean = false;
  ngOnInit(): void {
    var user: User = this.userService.getCurrentUser();
    if (user && user.type == ADMIN) this.canManage = true;
  }

  niveau: NiveauWithMatiere;
  nivId: string = '';

  matieresListAvailable: Array<Partial<Matiere>> = new Array<
    Partial<Matiere>
  >();
  matieres: Matiere[] = new Array<Matiere>();
  getAllMatiere() {
    this.matiereService.getAll().subscribe(
      (res: [Matiere]) => {
        console.log('Matieres : ', res);
        this.matieresListAvailable = [];
        this.matieres = res;
        this.updateAvailableMatieres();
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  updateAvailableMatieres() {
    const matiereIds = this.dataSource.data.map((x) => x.matiere);
    this.matieresListAvailable = this.matieres
      .filter((mat) => !matiereIds.includes(mat._id))
      .map((x) => ({ _id: x._id, name: x.name }));
  }

  drop(event: CdkDragDrop<NiveauMatiere[]>) {
    const previousIndex = this.dataSource.data.findIndex(
      (row) => row === event.item.data
    );
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    this.dataSource.data = this.dataSource.data.map(
      (item: NiveauMatiere, index: number) => ({ ...item, order: index })
    );
    const nivMats = {
      nivMats: this.dataSource.data.map((x) => ({
        _id: x._id,
        order: x.order,
      })),
    };
    this.niveauService.editMatieresOrders(nivMats).subscribe(
      (res) => {
        console.log('this.dataSource.data :', this.dataSource.data);
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  dataSource: MatTableDataSource<NiveauMatiere> =
    new MatTableDataSource<NiveauMatiere>();
  getNiveauWithMatiere() {
    this.niveauService.findByIdwithMatieres(this.nivId).subscribe(
      (res: NiveauWithMatiere) => {
        console.log('Niveaux With Matieres : ', res);
        this.niveau = res;
        if (res.nivmats)
          this.dataSource = new MatTableDataSource(
            res.nivmats.filter((x) => x && typeof x == 'object' && x.name)
          );
        else this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  onSubmit() {
    console.log('Submiting Data ..');
    if (this.form.value) {
      if (this.modalType === 'add') {
        this.niveauService
          .createNivMat({
            ...this.form.value,
            order: this.dataSource.data.length,
          })
          .subscribe((data: any) => {
            console.log('true ', data);
            this.matieresListAvailable = this.matieresListAvailable.filter(
              (x) => x._id != data.matiere
            );
            const nivmat = this.matieres.find((x) => x._id == data.matiere);
            if (nivmat) data.name = nivmat.name;
            this.dataSource.data.push(data);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.closeModal();
          });
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.niveauService
          .editNivMatById(this.form.value._id, {
            userId: this.form.value.userId,
            enabled: this.form.value.enabled,
            locked: this.form.value.locked,
          })
          .subscribe(
            (data: any) => {
              var array: NiveauMatiere[] = this.dataSource.data;
              var foundIndex = array.findIndex(
                (el: NiveauMatiere) => el._id == data._id
              );
              if (foundIndex > -1) {
                array[foundIndex].enabled = data.enabled;
                array[foundIndex].locked = data.locked;
                array[foundIndex].userId = data.userId;
              }
              this.dataSource = new MatTableDataSource(array);
              this.closeModal();
            },
            (err) => console.error(err)
          );
      }
    }
  }

  modalType: string = 'add';
  openModal(type = 'add') {
    this.clrModalOpen = true;
    if (type == 'add') {
      this.createForm();
      this.modalType = 'add';
    } else {
      this.modalType = 'edit';
    }
  }

  @ViewChild('myForm') mytemplateForm: NgForm;
  resetForm() {
    this.form.reset();
    this.createForm();
    this.mytemplateForm.reset();
    this.modalType = 'add';
  }

  closeModal() {
    this.resetForm();
    this.clrModalOpen = false;
  }

  goToChapitre(nivMatId: string) {
    this.router.navigate([
      'niveau/matiere/chapitres/list/',
      this.nivId,
      nivMatId,
    ]);
  }

  goToEnregistrement(nivMatId: string) {
    this.router.navigate([
      'niveau/matiere/enregistrements/list/',
      this.nivId,
      nivMatId,
    ]);
  }

  editById(body: Partial<NiveauMatiere>) {
    this.form.patchValue({
      _id: body._id,
      enabled: body.enabled,
      locked: body.locked,
      userId: body.userId,
      matiere: body.matiere,
      niveau: this.nivId,
    });
    this.openModal('edit');
  }

  // DELETE
  deleteById(nivMat) {
    this.niveauService.deleteNivMat(nivMat._id).subscribe(
      (res: any) => {
        console.log('res :', res);
        var foundIndex = this.dataSource.data.findIndex(
          (el) => el._id == nivMat._id
        );
        if (foundIndex > -1) {
          this.dataSource.data.splice(foundIndex, 1);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          // nivMat.matiere
          const matiere = this.matieres.find((x) => x._id == nivMat.matiere);
          this.matieresListAvailable.push(matiere);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
