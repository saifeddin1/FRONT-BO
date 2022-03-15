import { MatSort } from '@angular/material/sort';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Matiere, MatiereService } from '../matiere.service';
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  NgxFileDropEntry,
} from 'ngx-file-drop';
import { ImageService } from '../../../../services/image.service';
import { environment } from 'src/environments/environment';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-matiere',
  templateUrl: './list-matiere.component.html',
  styleUrls: ['./list-matiere.component.css'],
})
export class ListMatiereComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns: string[] = ['image', 'name', 'description', 'action'];

  constructor(
    private toasterService: ToasterService,
    private matiereService: MatiereService,
    private imageService: ImageService,
    private formBuilder: FormBuilder
  ) {
    this.getAll();
  }

  ngOnInit(): void {
    this.createForm();
  }
  paginatorOptions = {
    length: 10,
    pageSize: 10,
    currentPage: 0,
  };
  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    }) as FormGroup & Matiere;
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      description: body.description,
    });
  }

  dataSource: MatTableDataSource<Matiere> = new MatTableDataSource<Matiere>();
  getAll() {
    this.matiereService.getAll().subscribe(
      (res: [Matiere]) => {
        console.log('res : ', res);
        if (res && res.length) {
          res.forEach((matiere) => {
            if (matiere.img) {
              matiere.img = `${environment.LmsApiUrl}/api/matiere/documents/${matiere.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
            }
          });
        }
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
    } else {
      this.modalType = 'edit';
    }
  }

  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }

  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      var body: Partial<Matiere> = {
        name: this.form.value.name,
        description: this.form.value.description,
      };
      if (this.modalType === 'add') {
        this.matiereService.create(body).subscribe(
          (data: any) => {
            console.log('true ', data);
            this.uploadImage(data);
            this.dataSource.data.push(data);
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.toasterService.success(DEFAULT_MESSAGES.success.add);
            this.toasterService.info(DEFAULT_MESSAGES.success.image.loading);
            this.createForm();
          },
          (error) => {
            console.error('error :', error);
            this.toasterService.error(DEFAULT_MESSAGES.error.default);
          }
        );
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.matiereService.editById(this.form.value._id, body).subscribe(
          (data: Matiere) => {
            var array: Matiere[] = this.dataSource.data;
            var foundIndex = array.findIndex(
              (el: Matiere) => el._id == data._id
            );
            if (foundIndex > -1) {
              array[foundIndex].name = data.name;
              array[foundIndex].description = data.description;
            }
            this.uploadImage(data, foundIndex);
            this.dataSource = new MatTableDataSource(array);
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

  uploadImage(data, foundIndex = this.dataSource.data.length) {
    const matiereId: string = data._id;
    if (this.img && this.img.length) {
      for (const droppedFile of this.img) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            const formData = new FormData();
            formData.append('document', file, droppedFile.relativePath);
            this.toasterService.info(DEFAULT_MESSAGES.success.image.loading);
            this.imageService
              .uploadImage(formData, matiereId, 'matiere')
              .subscribe(
                (res) => {
                  this.toasterService.success(
                    DEFAULT_MESSAGES.success.image.upload
                  );
                  console.log('Image Added Successfully');
                  if (res.img) {
                    this.dataSource.data[
                      foundIndex
                    ].img = `${environment.LmsApiUrl}/api/matiere/documents/${res.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
                  }
                  this.dataSource = new MatTableDataSource(
                    this.dataSource.data
                  );
                  this.img = [];
                },
                (err) => {
                  console.log(err);
                  this.toasterService.error(DEFAULT_MESSAGES.error.default);
                }
              );
          });
        } else {
          // It was a directory (empty directories are added, otherwise only files)
          const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
          console.log(droppedFile.relativePath, fileEntry);
        }
      }
    }
  }

  // DELETE
  deleteById(_id, index) {
    this.matiereService.delete(_id).subscribe(
      (res: any) => {
        console.log('res :', res);
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (error) => {
        console.error('error :', error);
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
      }
    );
  }

  editById(body: Partial<Matiere>) {
    this.fillFormModel(body);
    this.openModal('edit');
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
              file.name.endsWith('.svg') ||
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
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        // const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
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
          this.imageService
            .uploadImage(formData, this.form.value._id, 'matiere')
            .subscribe(
              (res) => {
                console.log('image Changed Successfully');
                this.toasterService.success(
                  DEFAULT_MESSAGES.success.image.upload
                );
              },
              (err) => {
                console.log(err);
                this.toasterService.success(DEFAULT_MESSAGES.success.delete);
              }
            );
        });
      }
    }
  }

  // usage code from - https://www.npmjs.com/package/ngx-file-drop
  public fileOver(event) {
    console.log(event);
  }

  // usage code from - https://www.npmjs.com/package/ngx-file-drop
  public fileLeave(event) {
    console.log(event);
  }
}
