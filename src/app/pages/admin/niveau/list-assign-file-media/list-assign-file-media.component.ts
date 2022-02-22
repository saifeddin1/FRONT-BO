import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MediaType, MediaTypeService } from '../../media/media-type.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Media, MediaService } from '../../media/media.service';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MediaAssignFile, MediaAssignFileService } from './mediaAssignFile.service';
import { Chapitre, ChapitreService } from '../chapitre.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { NiveauMatiere, NiveauService } from '../niveau.service';
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  NgxFileDropEntry,
} from 'ngx-file-drop';
import { DEFAULT_MESSAGES, ToasterService } from 'src/app/services/toaster.service';
import { ImageService } from 'src/app/services/image.service';
import { ADMIN, INSTRUCTOR } from 'src/app/constants/roles.constant';

@Component({
  selector: 'app-list-assign-file-media',
  templateUrl: './list-assign-file-media.component.html',
  styleUrls: ['./list-assign-file-media.component.css']
})
export class ListAssignFileMediaComponent implements OnInit {

  chapId: string = "";
  mediaTypeId: string = "";
  mediaAssignId: string = "";
  nivId: string = "";
  nivMatId: string = "";
  paginatorOptions = {
    length: 100,
    pageSize: 10,
    currentPage: 0
  }

  constructor(
    private niveauService: NiveauService,
    private mediaTypeService: MediaTypeService,
    private mediaService: MediaService,
    private chapitreService: ChapitreService,
    private formBuilder: FormBuilder,
    private mediaAssignFileService: MediaAssignFileService,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private _location: Location,
    private router: Router,
    private toasterService: ToasterService,
    private imageService: ImageService
  ) {
    this.nivId = this.activatedRouter.snapshot.params['nivId'];
    this.nivMatId = this.activatedRouter.snapshot.params['nivMatId'];
    this.mediaTypeId = this.activatedRouter.snapshot.params['mediaTypeId'];
    this.chapId = this.activatedRouter.snapshot.params['chapId'];
    this.mediaAssignId = this.activatedRouter.snapshot.params['mediaAssignId'];
    if (!this.nivId || !this.nivMatId || !this.chapId || !this.mediaTypeId || !this.mediaAssignId) this._location.back();
    this.getAllMediaQueriable(this.paginatorOptions.currentPage,
      this.paginatorOptions.pageSize);
    this.getMediaTypeById();
    this.getChapitre();
    this.getAssignMediaFiles();
    this.debounceFilter()
    this.getNivMat()
  }
  canManage: boolean = false;
  ngOnInit(): void {
    var user: User = this.userService.getCurrentUser();
    if (user && (user.type === INSTRUCTOR && user.permissions.chapitre)
      || user.type === ADMIN
    ) this.canManage = true
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

  chapitre: Chapitre
  getChapitre() {
    this.chapitreService.findById(this.chapId).subscribe(
      (res) => {
        this.chapitre = res
      },
      (err) => console.log(err)
    );
  }


  searchSub$ = new Subject<string>();

  applyFilter(filterValue: string) {
    this.searchSub$.next(filterValue.trim().toLowerCase())
  }

  debounceFilter() {
    this.searchSub$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((filterValue: string) => {
      this.getNextSearchText = filterValue;
      this.getAllMediaQueriable(
        this.paginatorOptions.currentPage,
        this.paginatorOptions.pageSize,
        filterValue.trim().toLowerCase());
    });
  }

  getNextSearchText: string;
  getNext(event) {
    this.paginatorOptions.currentPage = event.pageIndex
    this.paginatorOptions.pageSize = event.pageSize;
    this.getAllMediaQueriable(event.pageIndex, event.pageSize, this.getNextSearchText);
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  mediasDataSource: MatTableDataSource<Media> = new MatTableDataSource<Media>();
  displayedSearchMediaColumns: string[] = ["name", "type", "action"];
  getAllMediaQueriable(page = 0, limit = 10, text: string = "") {
    this.mediaService.search(page, limit, text)
      .subscribe((result: { totalCount: { count: number }, totalData: [Media] }) => {
        console.log("mediasDataSource : ", result);
        if (result) {
          this.mediasDataSource = new MatTableDataSource<Media>(result.totalData);
          this.paginatorOptions.length = result.totalCount.count;
          console.log("mediasDataSource : ", result);
        } else {
          this.mediasDataSource = new MatTableDataSource<Media>();
          this.mediasDataSource.paginator = this.paginator;
          this.paginatorOptions.length = 0;
        }
      }, error => {
        console.error("error : ", error)
      })
  }

  openFile(element) {
    if (element.img) {
      const url = `${environment.apiUrl}/api/media/documents/${element.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
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

  assignMediaFiles: MatTableDataSource<MediaAssignFile> = new MatTableDataSource<MediaAssignFile>();
  displayedColumns: string[] = ["name", "locked", "enabled", "action"];
  getAssignMediaFiles() {
    this.mediaAssignFileService.getAssignMediaFiles(this.mediaAssignId)
      .subscribe((res: MediaAssignFile[]) => {
        this.assignMediaFiles = new MatTableDataSource<MediaAssignFile>(res);
        console.log("getAssignMediaFiles :", this.assignMediaFiles.data);
      }, error => {
        console.error("error :", error);
      })
  }

  onSubmit() {
    if (this.form.value) {
      console.log("this.formModel.value : ", this.form.value);
      const body = {
        locked: this.form.value.locked,
        enabled: this.form.value.enabled
      }
      // edit modal service
      this.mediaAssignFileService.editById(this.form.value._id, body)
        .subscribe(
          (data: MediaAssignFile) => {
            var array: MediaAssignFile[] = this.assignMediaFiles.data;
            var foundIndex = array.findIndex((el: MediaAssignFile) => el._id == data._id);
            if (foundIndex > -1) {
              array[foundIndex].locked = data.locked
              array[foundIndex].enabled = data.enabled
            }
            this.assignMediaFiles = new MatTableDataSource(array);
            this.closeEditModal();
          });
    }
  }

  clrEditModalOpen: boolean = false;
  form: FormGroup & MediaAssignFile;
  editById(element: Partial<MediaAssignFile>, index: number) {
    this.form = this.formBuilder.group({
      _id: [element._id, [Validators.required]],
      name: [element.mediaId.name, [Validators.required]],
      locked: [element.locked, [Validators.required]],
      enabled: [element.enabled, [Validators.required]],
    }) as FormGroup & MediaAssignFile;
    this.clrEditModalOpen = true;
  }

  closeEditModal() {
    this.clrEditModalOpen = false;
  }

  deleteById(_id: string, index: number) {
    this.mediaAssignFileService.delete(_id).subscribe(
      (res) => {
        this.assignMediaFiles.data.splice(index, 1);
        this.assignMediaFiles = new MatTableDataSource(this.assignMediaFiles.data);
        console.log("Deleted User Successfully")
      },
      (err) => console.log(err)
    );
  }

  // START Search Media Modal
  clrModalOpen: boolean = false;
  openModal() {
    this.clrModalOpen = true;

  }

  closeModal() {
    this.clrModalOpen = false;
  }
  // END Search Media Modal

  mediaName: string = "";
  clrCreateMediaModalOpen: boolean = false;
  openCreateMediaModal() {
    this.clrCreateMediaModalOpen = true;
    // this.mediaName = "";
  }

  closeCreateMediaModal() {
    this.clrCreateMediaModalOpen = false;
    // this.mediaName = "";
    this.img = [];
  }

  img: NgxFileDropEntry[] = [];
  imageError: string = 'No Image Has Been Selected';
  public droppedImage(image: NgxFileDropEntry[]) {
    this.img = image;
    for (const droppedFile of image) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(file.name.toLowerCase());

          if (
            !(
              file.name.toLowerCase().endsWith('.ppt') ||
              file.name.toLowerCase().endsWith('.pptx') ||
              file.name.toLowerCase().endsWith('.docx') ||
              file.name.toLowerCase().endsWith('.doc') ||
              file.name.toLowerCase().endsWith('.pdf') ||
              file.name.toLowerCase().endsWith('.png') ||
              file.name.toLowerCase().endsWith('.jpg') ||
              file.name.toLowerCase().endsWith('.jpeg')
            )
          ) {
            this.img = [];
            this.imageError = 'Mauvaise Image!';
          } else {
            this.imageError = '';
          }
        });
      }
    }
  }

  onSubmitUpload() {
    if (this.mediaName && this.mediaType && this.img) {
      var body: Partial<Media> = {
        name: this.mediaName,
        type: this.mediaTypeId,
      };
      if (this.img) {
        this.mediaService.create(body)
          .subscribe(
            (data: any) => {
              console.log('true ', data);
              this.uploadImage(data);
            },
            (err) => {
              console.log(err);
              this.toasterService.error(DEFAULT_MESSAGES.error.default)
            });
      }

    }
  }
  uploadImage(data) {
    const mediaId: string = data._id;
    if (this.img && this.img.length) {
      for (const droppedFile of this.img) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            const formData = new FormData();
            formData.append('document', file, droppedFile.relativePath);
            this.toasterService.info(DEFAULT_MESSAGES.success.image.loading);
            this.imageService.uploadImage(formData, mediaId, "media").subscribe(
              (res) => {
                console.log("Image Added Successfully");
                this.toasterService.success(DEFAULT_MESSAGES.success.image.upload);
                this.assignMediaFile(res)
                this.toasterService.success(DEFAULT_MESSAGES.success.add)
                this.closeCreateMediaModal();
              },
              (err) => {
                console.log(err);
                this.toasterService.error(DEFAULT_MESSAGES.error.default);
              });
          });
        } else {
          // It was a directory (empty directories are added, otherwise only files)
          const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
          console.log(droppedFile.relativePath, fileEntry);
        }
      }
    }
  }

  assignMediaFile(media) {
    console.log("assignMedia : ", media);
    const body = {
      mediaId: media._id,
      mediaAssignId: this.mediaAssignId,
      order: this.assignMediaFiles.data.length
    }
    // this.assignMediaFiles.data.push(body)
    this.mediaAssignFileService.create(body)
      .subscribe((res) => {
        this.assignMediaFiles.data.push({ ...res, mediaId: media })
        this.assignMediaFiles = new MatTableDataSource(this.assignMediaFiles.data);
      },
        (err) => console.log(err)
      );
  }

  dropAssignMedia(event: CdkDragDrop<MediaAssignFile[]>) {
    const previousIndex = this.assignMediaFiles.data.findIndex(row => row === event.item.data);
    moveItemInArray(this.assignMediaFiles.data, previousIndex, event.currentIndex);
    this.assignMediaFiles.data = this.assignMediaFiles.data.map((item: MediaAssignFile, index: number) => ({ ...item, order: index }));
    const docs = { data: this.assignMediaFiles.data.map(x => ({ _id: x._id, order: x.order })) }
    this.mediaAssignFileService.editOrders(docs)
      .subscribe((res) => {
        console.log("this.dataSource.data :", res);
      }, error => {
        console.error("error :", error);
      })
  }
}
