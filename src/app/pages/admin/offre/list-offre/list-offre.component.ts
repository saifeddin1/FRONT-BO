

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  NgxFileDropEntry,
} from 'ngx-file-drop';
import { ImageService } from 'src/app/services/image.service';
import { DEFAULT_MESSAGES, ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';
import { Offre, OffreService } from '../offre.service';


@Component({
  selector: 'app-list-offre',
  templateUrl: './list-offre.component.html',
  styleUrls: ['./list-offre.component.css']
})
export class ListOffreComponent implements OnInit {
  clrModalOpen: boolean = false;
  offreTypes: string[] = new Array<string>("ANNUEL", "MENSULLE");
  displayedColumns: string[] = [
    'image',
    'name',
    'description',
    'type',
    'prix',
    'pourcentageRemise',
    'withVideo',
    'withPDFCourses',
    'withLive',
    'withRecord',
    'action'
  ];

  displayedOptionColumns: string[] = [
    'name',
    'action'
  ];

  constructor(
    private toasterService: ToasterService,
    private offreService: OffreService,
    private imageService: ImageService,
    private formBuilder: FormBuilder,
  ) {
    this.getAll()
  }

  ngOnInit(): void {
    this.createForm();
  }

  dataSource: MatTableDataSource<Offre> = new MatTableDataSource<Offre>();
  getAll() {
    this.offreService.getAll()
      .subscribe((res: [Offre]) => {
        console.log("res : ", res)
        if (res && res.length) {
          res.forEach((offre) => {
            if (offre.img) {
              debugger
              offre.img =
                offre.img === '' || offre.img === null ? '' : `${environment.LmsApiUrl}/api/offre/documents/${offre.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
            }
          });
        }
        this.dataSource = new MatTableDataSource(res);
      }, error => {
        console.error("error : ", error)
      })
  }

  form: FormGroup & Offre;
  createForm() {
    this.form = this.formBuilder.group({
      _id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['ANNUEL', [Validators.required]],
      color: ['#000000', [Validators.required]],
      options: [[], [Validators.required]],
      // nbrMois: [0, [Validators.required]],
      prix: [0, [Validators.required]],
      pourcentageRemise: [0, [Validators.required]],
      withVideo: [false, [Validators.required]],
      withPDFCourses: [false, [Validators.required]],
      withLive: [false, [Validators.required]],
      withRecord: [false, [Validators.required]],
    }) as FormGroup & Offre;
    this.options = new MatTableDataSource<any>();
  }

  optionMode: string = "add";
  newOption: string = "";
  selectedIndex: number = -1;
  addOption() {
    if (["add", "edit"].includes(this.optionMode) && this.newOption) {
      if (this.optionMode == "add") {
        this.options.data.push(this.newOption);
      }
      else if (this.optionMode == "edit") {
        this.options.data[this.selectedIndex] = this.newOption;
      }
      this.options = new MatTableDataSource<any>(this.options.data);
      this.newOption = "";
      this.optionMode = "add";
    }
  }

  editOption(index) {
    this.optionMode = "edit";
    this.newOption = this.options.data[index];
    this.selectedIndex = index
  }

  deleteOption(index) {
    this.options.data.splice(index, 1);
    this.options = new MatTableDataSource<any>(this.options.data);
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
          this.imageService.uploadImage(formData, this.form.value._id, "offre").subscribe(
            (res) => {
              this.toasterService.success(DEFAULT_MESSAGES.success.image.upload);
              console.log("image Changed Successfully")
            },
            (err) => {
              console.log(err);
              this.toasterService.error(DEFAULT_MESSAGES.error.default);
            }
          );
        });
      }
    }
  }

  onSubmit() {
    if (this.form.value) {
      console.log("this.formModel.value : ", this.form.value);
      var body: Partial<Offre> = {
        name: this.form.value.name,
        description: this.form.value.description,
        type: this.form.value.type,
        color: this.form.value.color,
        prix: this.form.value.prix,
        pourcentageRemise: this.form.value.pourcentageRemise,
        withVideo: this.form.value.withVideo,
        withPDFCourses: this.form.value.withPDFCourses,
        withLive: this.form.value.withLive,
        withRecord: this.form.value.withRecord,
        options: this.options.data,
      };
      if (this.modalType === 'add') {
        this.offreService.create(body)
          .subscribe(
            (data: any) => {
              console.log('true ', data);
              this.uploadImage(data);
              this.dataSource.data.push(data);
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.toasterService.success(DEFAULT_MESSAGES.success.add);
              this.createForm();
              this.closeModal();
            }, error => {
              console.error("error :", error);
              this.toasterService.error(DEFAULT_MESSAGES.error.default);
            })
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.offreService.editById(this.form.value._id, body)
          .subscribe(
            (data: Offre) => {
              var array: Offre[] = this.dataSource.data;
              var foundIndex = array.findIndex((el: Offre) => el._id == data._id);
              if (foundIndex > -1) {
                array[foundIndex].name = data.name
                array[foundIndex].description = data.description
                array[foundIndex].type = data.type
                array[foundIndex].prix = data.prix
                array[foundIndex].pourcentageRemise = data.pourcentageRemise
                array[foundIndex].withVideo = data.withVideo
                array[foundIndex].withPDFCourses = data.withPDFCourses
                array[foundIndex].withLive = data.withLive
                array[foundIndex].withRecord = data.withRecord
              }
              this.uploadImage(data, foundIndex);
              this.dataSource = new MatTableDataSource(array);
              this.toasterService.success(DEFAULT_MESSAGES.success.edit);
              this.closeModal();
            }, error => {
              console.error("error :", error);
              this.toasterService.error(DEFAULT_MESSAGES.error.default);
            })
      }
    }
  }
  uploadImage(data, foundIndex = this.dataSource.data.length) {
    const offreId: string = data._id;
    if (this.img && this.img.length) {
      for (const droppedFile of this.img) {
        if (droppedFile.fileEntry.isFile) {
          const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          fileEntry.file((file: File) => {
            const formData = new FormData();
            formData.append('document', file, droppedFile.relativePath);
            this.toasterService.info(DEFAULT_MESSAGES.success.image.loading);
            this.imageService.uploadImage(formData, offreId, "offre").subscribe(
              (res) => {
                this.toasterService.success(DEFAULT_MESSAGES.success.image.upload);
                console.log("Image Added Successfully");
                if (res.img) {
                  this.dataSource.data[foundIndex].img = `${environment.LmsApiUrl}/api/offre/documents/${res.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
                }
                this.dataSource = new MatTableDataSource(this.dataSource.data);
                this.img = [];
              },
              (err) => {
                console.log(err);
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

  options: MatTableDataSource<string> = new MatTableDataSource<string>();
  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      description: body.description,
      type: body.type ? body.type : "ANNUEL",
      color: body.color ? body.color : "#000000",
      options: body.options,
      prix: body.prix,
      pourcentageRemise: body.pourcentageRemise,
      withVideo: body.withVideo,
      withPDFCourses: body.withPDFCourses,
      withLive: body.withLive,
      withRecord: body.withRecord,
    });
    this.options = new MatTableDataSource<any>(body.options);
  }

  editById(body: Partial<Offre>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  // DELETE
  deleteById(_id, index) {
    this.offreService.delete(_id)
      .subscribe(
        (res: any) => {
          console.log('res :', res);
          this.dataSource.data.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.dataSource.data);
          this.toasterService.success(DEFAULT_MESSAGES.success.delete);
        },
        err => {
          this.toasterService.error(DEFAULT_MESSAGES.error.default);
          console.log(err);
        },
      );
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
