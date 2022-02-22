

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  NgxFileDropEntry,
} from 'ngx-file-drop';
import { ADMIN, INSTRUCTOR } from 'src/app/constants/roles.constant';
import { User } from 'src/app/models/user.model';
import { ImageService } from 'src/app/services/image.service';
import { DEFAULT_MESSAGES, ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { MediaType, MediaTypeService } from '../media-type.service';
import { Media, MediaService } from '../media.service';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  displayedColumns: string[] = [
    'name',
    'type',
    'action'
  ];

  constructor(
    private mediaService: MediaService,
    private mediaTypeService: MediaTypeService,
    private toasterService: ToasterService,
    private imageService: ImageService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.getAll()
    this.getAllMediaTypes()
  }

  canManage: boolean = false;
  ngOnInit(): void {
    this.createForm();
    var user: User = this.userService.getCurrentUser()
    if (user && (user.type === INSTRUCTOR && user.permissions.media)
      || user.type === ADMIN
    ) this.canManage = true
  }
  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0
  }
  dataSource: MatTableDataSource<Media> = new MatTableDataSource<Media>();
  getAll() {
    this.mediaService.getAll()
      .subscribe((res: [Media]) => {
        console.log("res : ", res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }, error => {
        console.error("error : ", error)
      })
  }

  mediaTypes: MediaType[] = []
  getAllMediaTypes() {
    this.mediaTypeService.getAll()
      .subscribe((res: MediaType[]) => {
        console.log("MediaType : ", res);
        this.mediaTypes = res
      }, error => {
        console.error("error :", error);
      })
  }

  form: FormGroup & Media;
  createForm() {
    this.form = this.formBuilder.group({
      _id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      img: ['', [Validators.required]],
      type: ['', [Validators.required]],
    }) as FormGroup & Media;
  }

  getMediaTypeById = (_id: string) => {
    var foundType = this.mediaTypes.find(t => t._id === _id)
    if (foundType) {
      return foundType.name
    }
    return ""
  }
  img: NgxFileDropEntry[] = [];
  imageError: string = 'No Image Has Been Selected';
  public droppedImage(image: NgxFileDropEntry[]) {
    this.img = image;
    for (const droppedFile of image) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (
            !(
              file.name.endsWith('.ppt') ||
              file.name.endsWith('.pptx') ||
              file.name.endsWith('.docx') ||
              file.name.endsWith('.Docx') ||
              file.name.endsWith('.doc') ||
              file.name.endsWith('.DOC') ||
              file.name.endsWith('.pdf') ||
              file.name.endsWith('.PDF') ||
              file.name.endsWith('.png') ||
              file.name.endsWith('.jpg') ||
              file.name.endsWith('.JPG') ||
              file.name.endsWith('.JPEG') ||
              file.name.endsWith('.jpeg')
            )
          ) {
            this.img = [];
            this.imageError = 'Bad Image!';
          } else {
            this.imageError = '';
          }
        });
      }
    }
  }

  onChangeImage() {
    for (const droppedFile of this.img) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const formData = new FormData();
          formData.append('document', file, droppedFile.relativePath);
          this.toasterService.info(DEFAULT_MESSAGES.success.image.loading);
          this.imageService.uploadImage(formData, this.form.value._id, "media").subscribe(
            (res) => {
              console.log("image Changed Successfully")
              this.toasterService.success(DEFAULT_MESSAGES.success.image.upload);
            },
            (err) => {
              console.log(err);
              this.toasterService.error(DEFAULT_MESSAGES.error.default)
            }
          );
        });
      }
    }
  }

  onSubmit() {
    if (this.form.value) {
      console.log("this.formModel.value : ", this.form.value);
      var body: Partial<Media> = {
        name: this.form.value.name,
        type: typeof this.form.value.type == "object" ? this.form.value.type._id : this.form.value.type,
      };
      if (this.modalType === 'add') {
        if (this.img) {
          this.mediaService.create(body)
            .subscribe(
              (data: any) => {
                console.log('true ', data);
                this.uploadImage(data);
                this.dataSource.data.push(data);
                this.dataSource = new MatTableDataSource(this.dataSource.data);
                this.toasterService.success(DEFAULT_MESSAGES.success.add)
                this.createForm();
                this.closeModal();
              },
              (err) => {
                console.log(err);
                this.toasterService.error(DEFAULT_MESSAGES.error.default)
              });
        }
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.mediaService.editById(this.form.value._id, body)
          .subscribe(
            (data: Media) => {
              var array: Media[] = this.dataSource.data;
              var foundIndex = array.findIndex((el: Media) => el._id == data._id);
              if (foundIndex > -1) {
                array[foundIndex].name = data.name
                array[foundIndex].type = data.type
              }
              this.uploadImage(data, foundIndex);
              this.dataSource = new MatTableDataSource(array);
              this.toasterService.success(DEFAULT_MESSAGES.success.edit)
              this.closeModal();
            },
            (err) => {
              console.log(err);
              this.toasterService.error(DEFAULT_MESSAGES.error.default)
            });
      }
    }
  }
  uploadImage(data, foundIndex = this.dataSource.data.length) {
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
                if (res.img) {
                  this.dataSource.data[foundIndex].img = res.img // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
                }
                this.dataSource = new MatTableDataSource(this.dataSource.data);
                this.img = [];
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
    this.form.patchValue({
      _id: body._id,
      type: body.type && typeof body.type == "object" && body.type._id ? body.type._id : body.type,
      name: body.name,
    });
  }

  editById(body: Partial<Media>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  // DELETE
  deleteById(_id, index) {
    this.mediaService.delete(_id)
      .subscribe(
        (res: any) => {
          console.log('res :', res);
          this.dataSource.data.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.toasterService.success(DEFAULT_MESSAGES.success.delete);
        },
        err => {
          console.log(err);
          this.toasterService.error(DEFAULT_MESSAGES.error.default)
        },
      );
  }

  openFile(media) {
    if (media.img) {
      const url = `${environment.LmsApiUrl}/api/media/documents/${media.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
      console.log("url :", url);
      window.open(url);
    }
  }
}
