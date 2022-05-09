import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Seance, SeanceService } from '../seance.service';
import { UserService } from '../../../../services/user.service';
import {
  PaginatedResult,
  PaginationArgs,
} from '../../../../services/pagination.service';
import { User } from '../../../../models/user.model';
import { Router } from '@angular/router';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { ADMIN, INSTRUCTOR } from '../../../../constants/roles.constant';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-seance',
  templateUrl: './list-seance.component.html',
  styleUrls: ['./list-seance.component.css'],
})
export class ListSeanceComponent implements OnInit {
  clrModalOpen: boolean = false;
  constructor(
    private seanceService: SeanceService,
    private toasterService: ToasterService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.getSeances(
      new PaginationArgs(
        this.paginatorOptions.currentPage,
        this.paginatorOptions.pageSize
      )
    );
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
      console.log("MMMMM", this.instructors)
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  getInstuctorName = (instructorId) =>
    instructorId ? this.instructorsNames[instructorId] : "Pas d'instructeur";

  paginatorOptions = {
    length: 100,
    pageSize: 10,
    currentPage: 0,
  };

  canManage: boolean = false;
  canManageHomework: boolean = false;

  ngOnInit(): void {
    this.createForm();
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

  getNextSearchText: string;
  getNext(event) {
    this.paginatorOptions.currentPage = event.pageIndex;
    this.paginatorOptions.pageSize = event.pageSize;
    const query = new PaginationArgs(
      event.pageIndex,
      event.pageSize,
      this.getNextSearchText
    );
    this.getSeances(query);
  }

  dataSource: MatTableDataSource<Seance> = new MatTableDataSource<Seance>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = [
    'name',
    'userId',
    'url',
    'startDate',
    'endDate',
    'action',
  ];
  getSeances(query: PaginationArgs = new PaginationArgs()) {
    console.log('query :', query);
    this.seanceService.getAll(query).subscribe(
      (result: PaginatedResult | any) => {
        console.log('res : ', result);
        if (result) {
          this.dataSource = new MatTableDataSource<any>(result.totalData);
          this.paginatorOptions.length = result.totalCount.count;
          console.log('mediasDataSource : ', result);
        } else {
          this.dataSource = new MatTableDataSource<any>();
          this.dataSource.paginator = this.paginator;
          this.paginatorOptions.length = 0;
        }
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  form: FormGroup & Seance;
  createForm() {
    this.form = this.formBuilder.group({
      _id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      url: ['', [Validators.required]],
      urlInstructor: [''],
      urlAuthInstructor: [''],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
    }) as FormGroup & Seance;
  }

  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      var body: Partial<Seance> = {
        name: this.form.value.name,
        userId: this.form.value.userId,
        description: this.form.value.description,
        url: this.form.value.url,
        urlInstructor: this.form.value.urlInstructor,
        urlAuthInstructor: this.form.value.urlAuthInstructor,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
      };
      if (this.modalType === 'add') {
        this.seanceService.create(body).subscribe(
          (data: any) => {
            console.log('true ', data);
            var array = this.dataSource.data;
            array.push(data);
            this.dataSource = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.add);
            this.createForm();
          },
          (err) => {
            console.log(err);
            debugger;
            if (
              err &&
              err.status == 400 &&
              err.error.message &&
              err.error.errors &&
              Object.keys(err.error.errors).length
            ) {
              this.toasterService.error(
                DEFAULT_MESSAGES.confirmation.pleaseFill
              );
            } else {
              this.toasterService.error(DEFAULT_MESSAGES.error.default);
            }
          }
        );
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.seanceService.editById(this.form.value._id, body).subscribe(
          (data: Seance) => {
            var array: Seance[] = this.dataSource.data;
            var foundIndex = array.findIndex(
              (el: Seance) => el._id == data._id
            );
            if (foundIndex > -1) {
              array[foundIndex].name = data.name;
              array[foundIndex].userId = data.userId;
              array[foundIndex].description = data.description;
              array[foundIndex].url = data.url;
              array[foundIndex].urlInstructor = data.urlInstructor;
              array[foundIndex].urlAuthInstructor = data.urlAuthInstructor;
              array[foundIndex].startDate = data.startDate;
              array[foundIndex].endDate = data.endDate;
            }
            this.dataSource = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.edit);
            this.closeModal();
          },
          (err) => {
            console.log(err);
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
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      userId: body.userId,
      description: body.description,
      url: body.url,
      urlInstructor: body.urlInstructor,
      urlAuthInstructor: body.urlAuthInstructor,
      startDate: new Date(body.startDate).toISOString().split('.')[0],
      endDate: new Date(body.endDate).toISOString().split('.')[0],
    });
  }

  editById(body: Partial<Seance>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  // DELETE
  deleteById(_id, index) {
    this.seanceService.delete(_id).subscribe(
      (res: any) => {
        console.log('res :', res);
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => {
        console.log(err);
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
      }
    );
  }

  goToSeanceNiveau(seanceId: string): void {
    this.router.navigate(['seances/edit/niv', seanceId]);
  }

  goToSeanceExercices(seanceId: string): void {
    this.router.navigate(['seances/edit/mediaAssign/list/', seanceId]);
  }
}
