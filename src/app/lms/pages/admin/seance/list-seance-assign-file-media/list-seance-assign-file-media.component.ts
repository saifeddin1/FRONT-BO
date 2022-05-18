import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Media, MediaService } from '../../media/media.service';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import {
  MediaAssignFile,
  MediaAssignFileService,
} from '../../niveau/list-assign-file-media/mediaAssignFile.service';
import { Seance, SeanceService } from '../seance.service';
import {
  DEFAULT_MESSAGES,
  ToasterService,
} from '../../../../services/toaster.service';
import { ADMIN, INSTRUCTOR } from '../../../../constants/roles.constant';

@Component({
  selector: 'app-list-seance-assign-file-media',
  templateUrl: './list-seance-assign-file-media.component.html',
  styleUrls: ['./list-seance-assign-file-media.component.css'],
})
export class ListSeanceAssignFileMediaComponent implements OnInit {
  seanceId: string = '';
  mediaAssignId: string = '';
  paginatorOptions = {
    length: 100,
    pageSize: 10,
    currentPage: 0,
  };

  constructor(
    private toasterService: ToasterService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private mediaAssignFileService: MediaAssignFileService,
    private seanceService: SeanceService,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private _location: Location,
    private router: Router
  ) {
    this.seanceId = this.activatedRouter.snapshot.params['seanceId'];
    this.mediaAssignId = this.activatedRouter.snapshot.params['mediaAssignId'];
    if (!this.seanceId || !this.mediaAssignId) this._location.back();
    this.getAllMediaQueriable(
      this.paginatorOptions.currentPage,
      this.paginatorOptions.pageSize
    );
    this.getAssignMediaFiles();
    this.getSeance();
    this.debounceFilter();
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

  seance: Seance;
  getSeance() {
    this.seanceService.findById(this.seanceId).subscribe(
      (res) => {
        this.seance = res;
      },
      (err) => console.log(err)
    );
  }

  searchSub$ = new Subject<string>();

  applyFilter(filterValue: string) {
    this.searchSub$.next(filterValue.trim().toLowerCase());
  }

  debounceFilter() {
    this.searchSub$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((filterValue: string) => {
        this.getNextSearchText = filterValue;
        this.getAllMediaQueriable(
          this.paginatorOptions.currentPage,
          this.paginatorOptions.pageSize,
          filterValue.trim().toLowerCase()
        );
      });
  }

  getNextSearchText: string;
  getNext(event) {
    this.paginatorOptions.currentPage = event.pageIndex;
    this.paginatorOptions.pageSize = event.pageSize;
    this.getAllMediaQueriable(
      event.pageIndex,
      event.pageSize,
      this.getNextSearchText
    );
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  mediasDataSource: MatTableDataSource<Media> = new MatTableDataSource<Media>();
  displayedSearchMediaColumns: string[] = ['name', 'action'];
  getAllMediaQueriable(page = 0, limit = 10, text: string = '') {
    this.mediaService.search(page, limit, text).subscribe(
      (result: { totalCount: { count: number }; totalData: [Media] }) => {
        console.log('mediasDataSource : ', result);
        if (result) {
          this.mediasDataSource = new MatTableDataSource<Media>(
            result.totalData
          );
          this.paginatorOptions.length = result.totalCount.count;
          console.log('mediasDataSource : ', result);
        } else {
          this.mediasDataSource = new MatTableDataSource<Media>();
          this.mediasDataSource.paginator = this.paginator;
          this.paginatorOptions.length = 0;
        }
      },
      (error) => {
        console.error('error : ', error);
      }
    );
  }

  openFile(element) {
    if (element.img) {
      const url = `${environment.LmsApiUrl}/api/media/documents/${element.img}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
      console.log('url :', url);
      window.open(url);
    }
  }

  assignMediaFiles: MatTableDataSource<MediaAssignFile> =
    new MatTableDataSource<MediaAssignFile>();
  displayedColumns: string[] = ['name', 'locked', 'enabled', 'action'];
  getAssignMediaFiles() {
    this.mediaAssignFileService
      .getAssignMediaFiles(this.mediaAssignId)
      .subscribe(
        (res: MediaAssignFile[]) => {
          this.assignMediaFiles = new MatTableDataSource<MediaAssignFile>(res);
          console.log('getAssignMediaFiles :', this.assignMediaFiles.data);
        },
        (error) => {
          console.error('error :', error);
        }
      );
  }

  onSubmit() {
    if (this.form.value) {
      console.log('this.formModel.value : ', this.form.value);
      const body = {
        locked: this.form.value.locked,
        enabled: this.form.value.enabled,
      };
      // edit modal service
      this.mediaAssignFileService.editById(this.form.value._id, body).subscribe(
        (data: MediaAssignFile) => {
          var array: MediaAssignFile[] = this.assignMediaFiles.data;
          var foundIndex = array.findIndex(
            (el: MediaAssignFile) => el._id == data._id
          );
          if (foundIndex > -1) {
            array[foundIndex].locked = data.locked;
            array[foundIndex].enabled = data.enabled;
          }
          this.assignMediaFiles = new MatTableDataSource(array);
          this.toasterService.success(DEFAULT_MESSAGES.success.add);
          this.closeEditModal();
        },
        (error) => {
          console.error('error :', error);
          this.toasterService.error(DEFAULT_MESSAGES.error.default);
        }
      );
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
        this.assignMediaFiles = new MatTableDataSource(
          this.assignMediaFiles.data
        );
        console.log('Deleted User Successfully');
        this.toasterService.success(DEFAULT_MESSAGES.success.delete);
      },
      (err) => {
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
        console.log(err);
      }
    );
  }

  clrModalOpen: boolean = false;
  openModal() {
    this.clrModalOpen = true;
  }

  closeModal() {
    this.clrModalOpen = false;
  }

  assignMediaFile(media) {
    console.log('assignMedia : ', media);
    const body = {
      mediaId: media._id,
      mediaAssignId: this.mediaAssignId,
      order: this.assignMediaFiles.data.length,
    };
    // this.assignMediaFiles.data.push(body)
    this.mediaAssignFileService.create(body).subscribe(
      (res) => {
        this.assignMediaFiles.data.push({ ...res, mediaId: media });
        this.assignMediaFiles = new MatTableDataSource(
          this.assignMediaFiles.data
        );
        this.toasterService.success(DEFAULT_MESSAGES.success.add);
      },
      (err) => {
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
        console.log(err);
      }
    );
  }

  dropAssignMedia(event: CdkDragDrop<MediaAssignFile[]>) {
    const previousIndex = this.assignMediaFiles.data.findIndex(
      (row) => row === event.item.data
    );
    moveItemInArray(
      this.assignMediaFiles.data,
      previousIndex,
      event.currentIndex
    );
    this.assignMediaFiles.data = this.assignMediaFiles.data.map(
      (item: MediaAssignFile, index: number) => ({ ...item, order: index })
    );
    const docs = {
      data: this.assignMediaFiles.data.map((x) => ({
        _id: x._id,
        order: x.order,
      })),
    };
    this.mediaAssignFileService.editOrders(docs).subscribe(
      (res) => {
        console.log('this.dataSource.data :', res);
        this.toasterService.success(DEFAULT_MESSAGES.success.edit);
      },
      (error) => {
        this.toasterService.error(DEFAULT_MESSAGES.error.default);
        console.error('error :', error);
      }
    );
  }
}
