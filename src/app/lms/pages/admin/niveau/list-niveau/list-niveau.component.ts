import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ADMIN } from '../../../../constants/roles.constant';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { Niveau, NiveauService } from '../niveau.service';

@Component({
  selector: 'app-list-niveau',
  templateUrl: './list-niveau.component.html',
  styleUrls: ['./list-niveau.component.css'],
})
export class ListNiveauComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns: string[] = ['name', 'tag', 'isPublic', 'action'];

  constructor(
    private niveauService: NiveauService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.getNiveaux();
  }
  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0,
  };
  canManage: boolean = false;
  ngOnInit(): void {
    this.createForm();
    var user: User = this.userService.getCurrentUser();
    if (user && user.type === ADMIN) this.canManage = true;
  }

  drop(event: CdkDragDrop<Niveau[]>) {
    const previousIndex = this.dataSource.data.findIndex(
      (row) => row === event.item.data
    );
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    this.dataSource.data = this.dataSource.data.map(
      (item: Niveau, index: number) => ({ ...item, order: index })
    );
    const nivMats = {
      nivs: this.dataSource.data.map((x) => ({ _id: x._id, order: x.order })),
    };
    this.niveauService.editNivsOrders(nivMats).subscribe(
      (res) => {
        console.log('this.dataSource.data :', this.dataSource.data);
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      tag: ['', [Validators.required]],
      isPublic: [false, [Validators.required]],
      matieres: [[]],
    }) as FormGroup & Niveau;
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      tag: body.tag,
      isPublic: body.isPublic,
    });
  }

  dataSource: MatTableDataSource<Niveau> = new MatTableDataSource<Niveau>();
  getNiveaux() {
    this.niveauService.getAll().subscribe(
      (res: [Niveau]) => {
        console.log('Niveaux : ', res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  modalType: string = 'add';
  openModal(type = 'add') {
    this.clrModalOpen = true;
    if (type == 'add') {
      this.modalType = 'add';
      this.createForm();
    } else {
      this.modalType = 'edit';
    }
  }
  goToNiveauMatiere(id: string) {
    this.router.navigate(['niveau/matieres/list/', id]);
  }
  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }
  //ADD NIVEAU
  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      var body: Partial<Niveau> = {
        name: this.form.value.name,
        tag: this.form.value.tag,
        isPublic: this.form.value.isPublic,
      };
      debugger;
      if (this.modalType === 'add') {
        this.niveauService
          .createNiveau({ ...body, order: this.dataSource.data.length })
          .subscribe((data: any) => {
            console.log('true ', data);
            var array = this.dataSource.data;
            array.push(data);
            this.dataSource = new MatTableDataSource(array);
            this.createForm();
          });
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.niveauService
          .editById(this.form.value._id, body)
          .subscribe((data: Niveau) => {
            var array: Niveau[] = this.dataSource.data;
            var foundIndex = array.findIndex(
              (el: Niveau) => el._id == data._id
            );
            if (foundIndex > -1) {
              array[foundIndex].name = data.name;
              array[foundIndex].tag = data.tag;
              array[foundIndex].isPublic = data.isPublic;
              array[foundIndex].matieres = data.matieres;
            }
            this.dataSource = new MatTableDataSource(array);
            this.closeModal();
          });
      }
    }
  }

  editById(body: Partial<Niveau>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  // DELETE NIVEAU
  deleteById(_id, index) {
    this.niveauService.delete(_id).subscribe(
      (res: any) => {
        console.log('res :', res);
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
