import { Component, OnInit, ViewChild } from '@angular/core';
import { Niveau, NiveauService } from './../../niveau/niveau.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Offre, OffreService } from '../../offre/offre.service';
import { DEFAULT_MESSAGES, ToasterService } from 'src/app/services/toaster.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { STUDENT } from 'src/app/constants/roles.constant';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.component.html',
  styleUrls: ['./list-student.component.css']
})
export class ListStudentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'niveau',
    'offre',
    'action'
  ];

  constructor(
    private userService: UserService,
    private offreService: OffreService,
    private niveauService: NiveauService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
  ) {
    this.getStudents();
    this.getAllOffres();
    this.getAllNiveaux();
  }


  ngOnInit(): void {
    this.createForm();
  }
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  getStudents() {
    this.userService.getAllStudents()
      .subscribe((res: [User]) => {
        console.log("res : ", res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }, error => {
        console.error("error :", error);
      })
  }
  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0
  }

  form: FormGroup & User;
  createForm() {
    this.form = this.formBuilder.group({
      _id: [''],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      studentNiveauId: ['', [Validators.required]],
      studentOffreId: [''],
      phone: [''],
      fullName: [''],

    }) as FormGroup & User;
  }

  niveauxList: Niveau[] = new Array<Niveau>();
  getAllNiveaux() {
    this.niveauService.getAll()
      .subscribe((res: [Niveau]) => {
        console.log("Matieres : ", res);
        this.niveauxList = res;
      }, error => {
        console.error("error :", error);
      })
  }

  offresList: Offre[] = new Array<Offre>();
  getAllOffres() {
    this.offreService.getAll()
      .subscribe((res: [Offre]) => {
        console.log("Matieres : ", res);
        this.offresList = res;
      }, error => {
        console.error("error :", error);
      })
  }

  onSubmit() {
    if (this.form.value) {
      console.log("this.formModel.value : ", this.form.value);
      const body: any = {
        _id: this.form.value._id,
        password: this.form.value.password,
        username: this.form.value.username.toLowerCase(),
        email: this.form.value.email.toLowerCase(),
        profile: {
          fullName: this.form.value.fullName,
          phone: this.form.value.phone
        },
        type: STUDENT,
        studentNiveauId: this.form.value.studentNiveauId,
        studentOffreId: this.form.value.studentOffreId
      };
      if (this.modalType === 'add') {
        this.userService.postNewUser(body)
          .subscribe(
            (data: any) => {
              data = this.userService.decodeToken(data.token)
              console.log('true ', data);
              var array = this.dataSource.data;
              array.push(data);
              this.dataSource = new MatTableDataSource(array);
              this.toasterService.success(DEFAULT_MESSAGES.success.add)
              this.createForm();
            }, err => {
              console.error("error :", err);
              this.toasterService.error(DEFAULT_MESSAGES.error.default)
            });
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.userService.editById(this.form.value._id, body)
          .subscribe(
            (data: User) => {
              var array: User[] = this.dataSource.data;
              var foundIndex = array.findIndex((el: User) => el._id == data._id);
              if (foundIndex > -1) {
                array[foundIndex]._id = data._id
                array[foundIndex].username = data.username
                array[foundIndex].email = data.email
                array[foundIndex].password = data.password
                array[foundIndex].studentNiveauId = data.studentNiveauId
                array[foundIndex].studentOffreId = data.studentOffreId
                array[foundIndex].profile.fullName = data.profile && data.profile.fullName ? data.profile.fullName : ""
                array[foundIndex].profile.phone = data.profile && data.profile.phone ? data.profile.phone : ""
              }
              this.dataSource = new MatTableDataSource(array);
              this.toasterService.success(DEFAULT_MESSAGES.success.edit);
              this.closeModal();
            }, err => {
              console.error("error :", err);
              this.toasterService.error(DEFAULT_MESSAGES.error.default)
            });
      }
    }
  }

  modalType: string = "add";
  openModal(type = 'add') {
    this.clrModalOpen = true;
    if (type == 'add') {
      this.modalType = "add";
      this.createForm()
    } else {
      this.modalType = "edit";
    }
  }

  closeModal() {
    this.createForm();
    this.clrModalOpen = false
  }
  fillFormModel(body) {
    console.log("** fillFormModel **");
    console.log("body :", body);
    this.form.patchValue({
      _id: body._id || '',
      email: body.email || '',
      username: body.username || '',
      password: body.password || '',
      studentNiveauId: body.studentNiveauId ? body.studentNiveauId._id : '',
      studentOffreId: body.studentOffreId ? body.studentOffreId._id : '',
      fullName: body.profile && body.profile.fullName ? body.profile.fullName : "",
      phone: body.profile && body.profile.phone ? body.profile.phone : "",
    });
  }

  editById(body: Partial<User>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  deleteById(_id, index): void {
    this.userService.deleteUser(_id).subscribe(
      (res) => {
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        console.log("Deleted User Successfully")
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => {
        console.log(err)
        this.toasterService.error(DEFAULT_MESSAGES.error.default)
      }
    );
  }
}
