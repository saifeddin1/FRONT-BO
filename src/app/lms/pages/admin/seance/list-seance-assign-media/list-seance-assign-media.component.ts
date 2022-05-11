import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import {
  MediaAssign,
  MediaAssignService,
} from '../../niveau/list-assign-media/mediaAssign.service';
import { Seance, SeanceService } from '../seance.service';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { ADMIN, INSTRUCTOR } from '../../../../constants/roles.constant';

@Component({
  selector: 'app-list-seance-assign-media',
  templateUrl: './list-seance-assign-media.component.html',
  styleUrls: ['./list-seance-assign-media.component.css'],
})
export class ListSeanceAssignMediaComponent implements OnInit {
  seanceId: string = '';
  constructor(
    private toasterService: ToasterService,
    private seanceService: SeanceService,
    private formBuilder: FormBuilder,
    private mediaAssignService: MediaAssignService,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private _location: Location,
    private router: Router
  ) {
    this.seanceId = this.activatedRouter.snapshot.params['seanceId'];
    if (!this.seanceId) this._location.back();
    this.getSeanceMedias();
    this.getSeance();
    this.createForm();
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

  openFile(element) {
    if (element.img) {
      const url = `${environment.LmsApiUrl}/api/media/documents/${element.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
      console.log('url :', url);
      window.open(url);
    }
  }

  seance: Seance;
  getSeance() {
    this.seanceService.findById(this.seanceId).subscribe(
      (res) => {
        this.seance = res;
      },
      (err) => console.log(err)
    );
  }

  assignMedias: MatTableDataSource<MediaAssign> =
    new MatTableDataSource<MediaAssign>();
  displayedAssignMediaColumns: string[] = [
    'name',
    'videoUrl',
    'locked',
    'enabled',
    'action',
  ];
  getSeanceMedias() {
    this.mediaAssignService.findByAssignId(this.seanceId, undefined).subscribe(
      (res: MediaAssign[]) => {
        if (res && res.length)
          this.assignMedias = new MatTableDataSource<MediaAssign>(res);
      },
      (error) => {
        console.error('error :', error);
      }
    );
  }

  deleteMediaAssign(AssignMediaId: string, index: number) {
    this.mediaAssignService.delete(AssignMediaId).subscribe(
      (res) => {
        this.assignMedias.data.splice(index, 1);
        this.assignMedias = new MatTableDataSource(this.assignMedias.data);
        console.log('Deleted User Successfully');
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (error) => {
        console.error('error :', error);
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
      }
    );
  }

  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      console.log('Modal Type : ', this.modalType);
      if (this.modalType === 'add') {
        const body = {
          name: this.form.value.name,
          assignId: this.seanceId,
          videoUrl: this.form.value.videoUrl,
          order: this.assignMedias.data.length,
          locked: this.form.value.locked,
          enabled: this.form.value.enabled,
        };
        console.log('Body : ', body);
        this.mediaAssignService.create(body).subscribe(
          (data: any) => {
            console.log('true ', data);
            var array = this.assignMedias.data;
            array.push(data);
            this.assignMedias = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.add);
            this.resetForm();
          },
          (error) => {
            console.error('error :', error);
            this.toasterService.error(DEFAULT_MESSAGES.error.default);
          }
        );
      } else if (this.modalType === 'edit') {
        const body = {
          name: this.form.value.name,
          videoUrl: this.form.value.videoUrl,
          locked: this.form.value.locked,
          enabled: this.form.value.enabled,
        };
        // edit modal service
        this.mediaAssignService.editById(this.form.value._id, body).subscribe(
          (data: MediaAssign) => {
            var array: MediaAssign[] = this.assignMedias.data;
            var foundIndex = array.findIndex(
              (el: MediaAssign) => el._id == data._id
            );
            if (foundIndex > -1) {
              array[foundIndex].name = data.name;
              array[foundIndex].videoUrl = data.videoUrl;
              array[foundIndex].locked = data.locked;
              array[foundIndex].enabled = data.enabled;
            }
            this.assignMedias = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.edit);
            this.closeModal();
          },
          (error) => {
            console.error('error :', error);
            this.toasterService.error(DEFAULT_MESSAGES.error.default);
          }
        );
      }
    }
  }

  clrModalOpen: boolean = false;
  modalType = 'add';
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
    this.resetForm();
    this.clrModalOpen = false;
  }
  fillFormModel(body) {
    console.log('** fillFormModel **');
    console.log('body :', body);
    this.form.patchValue({
      _id: body._id || '',
      name: body.name || '',
      videoUrl: body.videoUrl || '',
      locked: body.locked || false,
      enabled: body.enabled || false,
    });
  }

  form: FormGroup & MediaAssign;
  createForm() {
    this.form = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required]],
      videoUrl: [''],
      locked: [true, [Validators.required]],
      enabled: [true, [Validators.required]],
    }) as FormGroup & MediaAssign;
  }

  editById(body: Partial<MediaAssign>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  @ViewChild('myForm') mytemplateForm: NgForm;
  resetForm() {
    this.createForm();
    this.mytemplateForm.reset();
    this.modalType = 'add';
  }

  dropAssignMedia(event: CdkDragDrop<MediaAssign[]>) {
    const previousIndex = this.assignMedias.data.findIndex(
      (row) => row === event.item.data
    );
    moveItemInArray(this.assignMedias.data, previousIndex, event.currentIndex);
    this.assignMedias.data = this.assignMedias.data.map(
      (item: MediaAssign, index: number) => ({ ...item, order: index })
    );
    const docs = {
      data: this.assignMedias.data.map((x) => ({ _id: x._id, order: x.order })),
    };
    this.mediaAssignService.editOrders(docs).subscribe(
      (res) => {
        console.log('this.dataSource.data :', res);
        this.toasterService.success(DEFAULT_MESSAGES.success.edit);
      },
      (error) => {
        console.error('error :', error);
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
      }
    );
  }

  goToFiles(mediaId) {
    this.router.navigateByUrl(
      `lms/seances/edit/mediaAssignFile/list/${this.seanceId}/${mediaId}`
    );
    // this.router.navigate([
    //   'seances/edit/mediaAssignFile/list/',
    //   this.seanceId,
    //   mediaId,
    // ]);
  }
}
