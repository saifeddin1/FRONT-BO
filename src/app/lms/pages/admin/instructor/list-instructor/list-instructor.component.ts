import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { Router } from '@angular/router';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { INSTRUCTOR } from '../../../../constants/roles.constant';
import { UsersService } from 'src/app/eidentity/services/users.service';

@Component({
  selector: 'app-list-instructor',
  templateUrl: './list-instructor.component.html',
  styleUrls: ['./list-instructor.component.css'],
})
export class ListInstructorComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  displayedColumns: string[] = ['name', 'email', 'action'];

  constructor(
    private toasterService: ToasterService,
    private userService: UserService,
    private router: Router,
    private identityService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.getInstructors();
  }
  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0,
  };
  ngOnInit(): void {
    this.createForm();
  }
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  getInstructors() {
    // this.userService.getAllInstructors().subscribe(
    this.identityService.getallInstructor().subscribe(
      (res: [User]) => {
        console.log('res : ', res);
        this.dataSource = new MatTableDataSource(res['response']);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  form: FormGroup & User;
  createForm() {
    this.form = this.formBuilder.group({
      _id: [''],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      // fullName: ['', [Validators.required]],
      chapitre: [false, [Validators.required]],
      media: [false, [Validators.required]],
      seance: [false, [Validators.required]],
      homework: [false, [Validators.required]],
    }) as FormGroup & User;
  }

  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      const body: any = {
        _id: this.form.value._id,
        username: this.form.value.username.toLowerCase(),
        password: this.form.value.password,
        email: this.form.value.email.toLowerCase(),
        profile: {
          // fullName: this.form.value.fullName,
          phone: this.form.value.phone,
        },
        permissions: {
          chapitre: this.form.value.chapitre,
          media: this.form.value.media,
          seance: this.form.value.seance,
          homework: this.form.value.homework,
        },
        type: INSTRUCTOR,
      };
      if (this.modalType === 'add') {
        this.userService.postNewUser(body).subscribe(
          (data: any) => {
            data = this.userService.decodeToken(data.token);

            console.log('true ', data);
            var array = this.dataSource.data;
            array.push(data);
            this.dataSource = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.add);
            this.createForm();
          },
          (err) => {
            console.error('error :', err);
            this.toasterService.error(DEFAULT_MESSAGES.error.default);
          }
        );
      } else if (this.modalType === 'edit') {
        //edit modal service
        delete body.password;
        this.userService.editById(this.form.value._id, body).subscribe(
          (data: User) => {
            var array: User[] = this.dataSource.data;
            var foundIndex = array.findIndex((el: User) => el._id == data._id);
            if (foundIndex > -1) {
              array[foundIndex]._id = data._id;
              array[foundIndex].email = data.email;
              array[foundIndex].username = data.username;
              // array[foundIndex].profile.fullName = data.profile.fullName;
              array[foundIndex].profile.phone =
                data.profile && data.profile.phone ? data.profile.phone : '';
              array[foundIndex].permissions.chapitre =
                data.permissions.chapitre;
              array[foundIndex].permissions.media = data.permissions.media;
              array[foundIndex].permissions.seance = data.permissions.seance;
              array[foundIndex].permissions.homework =
                data.permissions.homework;
            }
            this.dataSource = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.edit);
            this.closeModal();
          },
          (err) => {
            console.error('error :', err);
            this.toasterService.error(DEFAULT_MESSAGES.error.default);
          }
        );
      }
    }
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

  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }
  fillFormModel(body) {
    console.log('** fillFormModel **');
    console.log('body :', body);
    if (body.type === INSTRUCTOR && !body.permissions) {
      body.permissions = {
        chapitre: false,
        media: false,
        seance: false,
        homework: false,
      };
    }

    this.form.patchValue({
      _id: body._id || '',
      email: body.email || '',
      username: body.username || '',
      password: body.password || 'editMode',
      // fullName: body.profile.fullName || '',
      phone: body.profile && body.profile.phone ? body.profile.phone : '',
      chapitre: body.permissions.chapitre || false,
      media: body.permissions.media || false,
      seance: body.permissions.seance || false,
      homework: body.permissions.homework || false,
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
        console.log('Deleted User Successfully');
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => {
        console.log(err);
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
      }
    );
  }

  goToInsTructorNiveau(userId: string): void {
    this.router.navigateByUrl(`${this.router.url}/edit/niv/${userId}`);
    // this.router.navigate(['instructors/edit/niv', userId]);
  }
}
