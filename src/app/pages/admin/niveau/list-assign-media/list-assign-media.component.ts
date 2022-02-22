import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MediaType, MediaTypeService } from '../../media/media-type.service';
import { MediaAssign, MediaAssignService } from './mediaAssign.service';
import { environment } from 'src/environments/environment';
import { Chapitre, ChapitreService } from '../chapitre.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { NiveauMatiere, NiveauService } from '../niveau.service';
import { MediaReviewService } from 'src/app/services/mediaReview.service';
import { ADMIN, INSTRUCTOR } from 'src/app/constants/roles.constant';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-assign-media',
  templateUrl: './list-assign-media.component.html',
  styleUrls: ['./list-assign-media.component.css']
})
export class ListAssignMediaComponent implements OnInit {

  chapId: string = "";
  mediaTypeId: string = "";
  nivId: string = "";
  nivMatId: string = "";
  paginatorOptions = {
    length: 100,
    pageSize: 10,
    currentPage: 0
  }

  constructor(
    private mediaTypeService: MediaTypeService,
    private mediaReviewService: MediaReviewService,
    private chapitreService: ChapitreService,
    private formBuilder: FormBuilder,
    private niveauService: NiveauService,
    private mediaAssignService: MediaAssignService,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private _location: Location,
    private router: Router
  ) {
    this.nivId = this.activatedRouter.snapshot.params['nivId'];
    this.nivMatId = this.activatedRouter.snapshot.params['nivMatId'];
    this.mediaTypeId = this.activatedRouter.snapshot.params['mediaTypeId'];
    this.chapId = this.activatedRouter.snapshot.params['chapId'];
    if (!this.nivId || !this.nivMatId || !this.chapId || !this.mediaTypeId) this._location.back();
    this.getMediaTypeById();
    this.getChapitreMedias();
    this.getChapitre();
    this.createForm()
    this.getNivMat()
  }
  canManage: boolean = false;
  ngOnInit(): void {
    var user: User = this.userService.getCurrentUser();
    if (user && (user.type === INSTRUCTOR && user.permissions.chapitre)
      || user.type === ADMIN
    ) this.canManage = true
  }

  getAssignMediaRating(id) {
    this.mediaReviewService.getAssignMediaRating(id)
      .subscribe(res => {
        console.log("getAssignMediaRating res:", res);
        const Swal = require('sweetalert2')
        Swal.fire(
          'Avis',
          `Nombre : ${res.count}, pourcentage : ${(res.percent / 5) * 100}%`,
        )
      }, error => {
        console.error("getAssignMediaRating error :", error);

      })
  }

  nivMat: NiveauMatiere = null;
  getNivMat() {
    this.niveauService.getMatiereByNivMatId(this.nivMatId)
      .subscribe((res: NiveauMatiere) => {
        console.log("res :", res);
        if (res) this.nivMat = res;
      }, err => {
        console.log("err :", err);
      });
  }

  openFile(element) {
    if (element.img) {
      const url = `${environment.LmsApiUrl}/api/media/documents/${element.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
      console.log("url :", url);
      window.open(url);
    }
  }

  mediaType: MediaType;
  getMediaTypeById() {
    this.mediaTypeService.findById(this.mediaTypeId)
      .subscribe((res: MediaType) => {
        console.log("res : ", res);
        if (res) {
          this.mediaType = res;
          console.log("this.mediaType :", this.mediaType);
        }
      }, error => {
        console.error("error :", error);
      })
  }

  chapitre: Chapitre
  getChapitre() {
    this.chapitreService.findById(this.chapId).subscribe(
      (res) => {
        this.chapitre = res
      },
      (err) => console.log(err)
    );
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  assignMedias: MatTableDataSource<MediaAssign> = new MatTableDataSource<MediaAssign>();
  displayedAssignMediaColumns: string[] = ["name", "videoUrl", "videoEnabled", "locked", "enabled", "action"];
  getChapitreMedias() {
    this.mediaAssignService.findByAssignId(this.chapId, this.mediaTypeId)
      .subscribe((res: MediaAssign[]) => {
        this.assignMedias = new MatTableDataSource<MediaAssign>(res);
        this.assignMedias.paginator = this.paginator;
        this.assignMedias._updateChangeSubscription()
        console.log("this.mediaType :", this.mediaType);
      }, error => {
        console.error("error :", error);
      })
  }

  deleteMediaAssign(AssignMediaId: string, index: number) {
    this.mediaAssignService.delete(AssignMediaId).subscribe(
      (res) => {
        this.assignMedias.data.splice(index, 1);
        this.assignMedias = new MatTableDataSource(this.assignMedias.data);
        this.assignMedias._updateChangeSubscription()
        this.assignMedias.paginator = this.paginator;
        console.log("Deleted User Successfully")
      },
      (err) => console.log(err)
    );
  }

  onSubmit() {
    if (this.form.value) {
      console.log("this.formModel.value : ", this.form.value);
      console.log("Modal Type : ", this.modalType)
      if (this.modalType === 'add') {
        const body = {
          name: this.form.value.name,
          assignId: this.chapId,
          mediaTypeId: this.mediaTypeId,
          videoUrl: this.form.value.videoUrl,
          videoEnabled: this.form.value.videoEnabled,
          order: this.assignMedias.data.length,
          locked: this.form.value.locked,
          enabled: this.form.value.enabled,
        }
        console.log("Body : ", body);
        this.mediaAssignService.create(body)
          .subscribe(
            (data: any) => {
              console.log('true ', data);
              var array = this.assignMedias.data;
              array.push(data);
              this.assignMedias = new MatTableDataSource(array);
              this.assignMedias.paginator = this.paginator;
              this.assignMedias._updateChangeSubscription()
              this.resetForm();
            });
      } else if (this.modalType === 'edit') {
        const body = {
          name: this.form.value.name,
          videoUrl: this.form.value.videoUrl,
          videoEnabled: this.form.value.videoEnabled,
          locked: this.form.value.locked,
          enabled: this.form.value.enabled
        }
        // edit modal service
        this.mediaAssignService.editById(this.form.value._id, body)
          .subscribe(
            (data: MediaAssign) => {
              var array: MediaAssign[] = this.assignMedias.data;
              var foundIndex = array.findIndex((el: MediaAssign) => el._id == data._id);
              if (foundIndex > -1) {
                array[foundIndex].name = data.name
                array[foundIndex].videoUrl = data.videoUrl
                array[foundIndex].videoEnabled = data.videoEnabled
                array[foundIndex].locked = data.locked
                array[foundIndex].enabled = data.enabled
              }
              this.assignMedias = new MatTableDataSource(array);
              this.closeModal();
            });
      }
    }
  }

  clrModalOpen: boolean = false;
  modalType = 'add'
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
    this.resetForm();
    this.clrModalOpen = false;
  }
  fillFormModel(body) {
    console.log("** fillFormModel **");
    console.log("body :", body);
    debugger
    this.form.patchValue({
      _id: body._id || '',
      name: body.name || '',
      videoUrl: body.videoUrl || '',
      videoEnabled: body.videoEnabled || false,
      locked: body.locked || false,
      enabled: body.enabled || false,
    });
  }

  form: FormGroup & MediaAssign;
  createForm() {
    this.form = this.formBuilder.group({
      _id: [""],
      name: ["", [Validators.required]],
      videoUrl: ["", [Validators.required]],
      videoEnabled: [true, [Validators.required]],
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
    this.createForm()
    this.mytemplateForm.reset();
    this.modalType = 'add'
  }

  dropAssignMedia(event: CdkDragDrop<MediaAssign[]>) {
    const previousIndex = this.assignMedias.data.findIndex(row => row === event.item.data);
    moveItemInArray(this.assignMedias.data, previousIndex, event.currentIndex);
    this.assignMedias.data = this.assignMedias.data.map((item: MediaAssign, index: number) => ({ ...item, order: index }));
    const docs = { data: this.assignMedias.data.map(x => ({ _id: x._id, order: x.order })) }
    this.mediaAssignService.editOrders(docs)
      .subscribe((res) => {
        console.log("this.dataSource.data :", res);
      }, error => {
        console.error("error :", error);
      })
  }

  goToFiles(mediaId) {
    this.router.navigate(['niveau/matiere/chapitre/mediaAssignFile/list/', this.nivId, this.nivMatId, this.mediaTypeId, this.chapId, mediaId]);
  }
}
