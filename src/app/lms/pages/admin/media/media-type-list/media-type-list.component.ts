import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { MediaType, MediaTypeService } from '../media-type.service';

@Component({
  selector: 'app-media-type-list',
  templateUrl: './media-type-list.component.html',
  styleUrls: ['./media-type-list.component.css'],
})
export class MediaTypeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns: string[] = ['name', 'nameSingulier', 'category', 'action'];
  categoriesList: { name: string; value: string }[] = [
    { name: 'Média Privé', value: 'PRIVATE' },
    { name: 'Média Publique', value: 'PUBLIC' },
  ];

  constructor(
    private mediaTypeService: MediaTypeService,
    private toasterService: ToasterService,
    private router: Router,
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
  drop(event: CdkDragDrop<MediaType[]>) {
    const previousIndex = this.dataSource.data.findIndex(
      (row) => row === event.item.data
    );
    moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    this.dataSource.data = this.dataSource.data.map(
      (item: MediaType, index: number) => ({ ...item, order: index })
    );
    const data = {
      data: this.dataSource.data.map((x) => ({ _id: x._id, order: x.order })),
    };
    this.mediaTypeService.editOrders(data).subscribe(
      (res) => {
        console.log('this.dataSource.data :', this.dataSource.data);
        this.toasterService.success(DEFAULT_MESSAGES.success.edit);
      },
      (error) => {
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
        console.error('error :', error);
      }
    );
  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      nameSingulier: ['', [Validators.required]],
      category: ['', [Validators.required]],
      order: [0, [Validators.required]],
      enabled: [true, [Validators.required]],
    }) as FormGroup & MediaType;
  }

  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      nameSingulier: body.nameSingulier,
      category: body.category,
      order: body.order,
      enabled: body.enabled,
    });
  }

  dataSource: MatTableDataSource<MediaType> =
    new MatTableDataSource<MediaType>();
  getAll() {
    this.mediaTypeService.getAll().subscribe(
      (res: [MediaType]) => {
        console.log('MediaType : ', res);
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

  closeModal() {
    this.createForm();
    this.clrModalOpen = false;
  }
  //ADD mediaType
  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      var body: Partial<MediaType> = {
        name: this.form.value.name,
        nameSingulier: this.form.value.nameSingulier,
        category: this.form.value.category,
        enabled: this.form.value.enabled,
      };
      if (this.modalType === 'add') {
        this.mediaTypeService
          .create({ ...body, order: this.dataSource.data.length })
          .subscribe(
            (data: any) => {
              console.log('true ', data);
              var array = this.dataSource.data;
              array.push(data);
              this.dataSource = new MatTableDataSource(array);
              this.toasterService.success(DEFAULT_MESSAGES.success.add);
              this.createForm();
            },
            (error) => {
              this.toasterService.error(DEFAULT_MESSAGES.error.default);
              console.error('error :', error);
            }
          );
      } else if (this.modalType === 'edit') {
        //edit modal service
        this.mediaTypeService.editById(this.form.value._id, body).subscribe(
          (data: MediaType) => {
            var array: MediaType[] = this.dataSource.data;
            var foundIndex = array.findIndex(
              (el: MediaType) => el._id == data._id
            );
            if (foundIndex > -1) {
              array[foundIndex].name = data.name;
              array[foundIndex].nameSingulier = data.nameSingulier;
              array[foundIndex].category = data.category;
              array[foundIndex].enabled = data.enabled;
            }
            this.dataSource = new MatTableDataSource(array);
            this.toasterService.success(DEFAULT_MESSAGES.success.edit);
            this.closeModal();
          },
          (error) => {
            this.toasterService.error(DEFAULT_MESSAGES.error.default);
            console.error('error :', error);
          }
        );
      }
    }
  }

  editById(body: Partial<MediaType>) {
    this.fillFormModel(body);
    this.openModal('edit');
  }

  // DELETE mediaType
  deleteById(_id, index) {
    this.mediaTypeService.delete(_id).subscribe(
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
}
