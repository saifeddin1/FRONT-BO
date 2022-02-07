import { MatSort } from '@angular/material/sort';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chapitre, ChapitreService } from '../chapitre.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MediaType, MediaTypeService } from '../../media/media-type.service';
import { NivMatChapitre, NivMatChapitreService, GetAllResult } from '../nivMatChapitre.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { ADMIN, INSTRUCTOR } from 'src/app/constants/roles.constant';

@Component({
  selector: 'app-list-chapitre',
  templateUrl: './list-chapitre.component.html',
  styleUrls: ['./list-chapitre.component.css']
})
export class ListChapitreComponent implements OnInit {


  nivId: string = "";
  nivMatId: string = "";
  displayedColumns: string[] = [
    'name',
    'locked',
    'enabled',
    'action'
  ];
  paginatorOptions = {
    length: 100,
    pageSize: 5,
    currentPage: 0
  }
  constructor(
    private chapitreService: ChapitreService,
    private nivMatChapitreService: NivMatChapitreService,
    private mediaTypeService: MediaTypeService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private _location: Location,
    private router: Router
  ) {
    this.nivId = this.activatedRouter.snapshot.params['nivId'];
    this.nivMatId = this.activatedRouter.snapshot.params['nivMatId'];
    if (!this.nivId || !this.nivMatId) this._location.back();
    this.getAssignedChapitresByNivMatId();
    this.getAllMediaTypes();
    this.getAllChapitreQueriable(this.paginatorOptions.currentPage,
      this.paginatorOptions.pageSize);
      console.log("paginator",this.getAllChapitreQueriable);

    this.debounceFilter()
    this.createForm();
  }

  canManage: boolean = false;
  ngOnInit(): void {

    var user: User = this.userService.getCurrentUser();
    if (user && (user.type === INSTRUCTOR && user.permissions.chapitre)
    || user.type === ADMIN
    ) this.canManage = true

  }

  debounceFilter() {
    this.searchSub$.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((filterValue: string) => {
      this.getNextSearchText = filterValue;
      this.getAllChapitreQueriable(
        this.paginatorOptions.currentPage,
        this.paginatorOptions.pageSize,
        filterValue.trim().toLowerCase());
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  chapitreDataSource: MatTableDataSource<Chapitre> = new MatTableDataSource<Chapitre>();
  displayedSearchChapitreColumns: string[] = ["name", "action"];
  getAllChapitreQueriable(page = 0, limit = 10, text: string = "") {
    this.chapitreService.search(page, limit, text)
      .subscribe((result: { totalCount: { count: number }, totalData: [Chapitre] }) => {
        console.log("chapitreDataSource : ", result);
        if (result) {
          this.chapitreDataSource = new MatTableDataSource<Chapitre>(result.totalData);
          this.paginatorOptions.length = result.totalCount.count;
          console.log("chapitreDataSource : ", result);
        } else {
          this.chapitreDataSource = new MatTableDataSource<Chapitre>();
          this.chapitreDataSource.paginator = this.paginator;
          this.paginatorOptions.length = 0;
        }
      }, error => {
        console.error("error : ", error)
      })
  }

  getNextSearchText: string;
  getNext(event) {
    console.log("event",event);

    this.paginatorOptions.currentPage = event.pageIndex
    this.paginatorOptions.pageSize = event.pageSize;

    this.getAllChapitreQueriable(event.pageIndex, event.pageSize, this.getNextSearchText);



  }

  searchSub$ = new Subject<string>();

  applyFilter(filterValue: string) {
    this.searchSub$.next(filterValue.trim().toLowerCase())
  }

  nivMatChapitres: MatTableDataSource<any> = new MatTableDataSource<any>();
  data: GetAllResult
  getAssignedChapitresByNivMatId() {
    this.nivMatChapitreService.getAll(this.nivId, this.nivMatId)
      .subscribe((res: GetAllResult) => {
        console.log("res : ", res);
        if (res) {
          this.data = res;
          console.log("this.data :", this.data);
          this.nivMatChapitres = new MatTableDataSource<any>(res.nivMatChaps.sort((a, b) => a.order - b.order));
          this.nivMatChapitres.paginator = this.paginator;
          console.log("this.chapitres :", this.nivMatChapitres.data);
        }
      }, error => {
        console.error("error :", error);
      })
  }

  drop(event: CdkDragDrop<NivMatChapitre[]>) {
    const previousIndex = this.nivMatChapitres.data.findIndex(row => row === event.item.data);
    moveItemInArray(this.nivMatChapitres.data, previousIndex, event.currentIndex);
    this.nivMatChapitres.data = this.nivMatChapitres.data.map((item: Chapitre, index: number) => ({ ...item, order: index }));
    const chapitres = { data: this.nivMatChapitres.data.map(x => ({ _id: x._id, order: x.order })) }
    this.nivMatChapitreService.editOrders(chapitres)
      .subscribe((res) => {
        console.log("this.dataSource.data :", this.nivMatChapitres.data);
      }, error => {
        console.error("error :", error);
      })
  }

  chapitreMode: string = 'add';
  editChapitre(element: any) {
    this.chapitreMode = 'edit'
    console.log("Editing Chapitre ..");
    this.form.patchValue({
      _id: element._id,
      name: element.name,
      nivMatId: this.nivMatId,
      chapitreId: element.chapitreId,
      locked: element.locked,
      enabled: element.enabled
    })
    this.openModal()
  }

  onSubmit() {
    if (this.chapitreMode == 'add') {
      console.log("Adding Chapitre ..");
      this.nivMatChapitreService.createWithChapitre({ ...this.form.value, order: this.nivMatChapitres.data.length })
        .subscribe(res => {
          this.nivMatChapitres.data.push(res)
          this.nivMatChapitres = new MatTableDataSource(this.nivMatChapitres.data);
          console.log("Successfully Added Chapitre ..", res);
          this.getAllChapitreQueriable()
          this.closeModal()
        }, err => { console.log("err :", err) });

    } else if (this.chapitreMode == 'edit') {
      this.nivMatChapitreService.editByIdwithChapitre(this.form.value._id, this.form.value)
        .subscribe((res: any) => {
          var array = this.nivMatChapitres.data;
          var foundIndex = array.findIndex((el: Chapitre) => el._id == res._id);
          if (foundIndex > -1) {
            array[foundIndex].name = res.name
            array[foundIndex].description = res.description
            array[foundIndex].locked = res.locked
            array[foundIndex].enabled = res.enabled
          }
          this.nivMatChapitres = new MatTableDataSource(array);
          console.log("Successfully Edited Chapitre ..", res);
          this.resetForm()
          this.getAllChapitreQueriable()
          this.closeModal()
        }, err => { console.log("err :", err) });
    }
  }

  deleteNivMatChapitreId(nivMatChapId, index) {
    console.log("Deleting Chapitre ..");
    console.log("Chapitre Id : ", nivMatChapId)
    this.nivMatChapitreService.delete(nivMatChapId)
      .subscribe(res => {
        this.nivMatChapitres.data.splice(index, 1);
        this.nivMatChapitres = new MatTableDataSource(this.nivMatChapitres.data);
        console.log("Successfully Deleted Chapitre.", res);
      }, err => console.log("err :", err));
  }

  deleteChapitreById(_id, index): void {
    this.chapitreService.delete(_id).subscribe(
      (res) => {
        this.chapitreDataSource.data.splice(index, 1);
        this.chapitreDataSource = new MatTableDataSource(this.chapitreDataSource.data);
        console.log("Chapitre Deleted Successfully")
      },
      (err) => console.log(err)
    );
  }

  clrListModalOpen: boolean = false;
  openListModal() {
    this.clrListModalOpen = true;
    this.createForm()
  }

  closeListModal() {
    this.clrListModalOpen = false
    this.getNextSearchText = "";
  }

  clrModalOpen: boolean = false;
  openModal() {
    this.clrModalOpen = true;
    // this.createForm()
  }

  closeModal() {
    this.clrModalOpen = false
    this.resetForm()
  }

  @ViewChild('myForm') mytemplateForm: NgForm;
  resetForm() {
    this.createForm()
    this.mytemplateForm.reset();
    this.chapitreMode = 'add'
  }

  form: FormGroup & Partial<Chapitre> & Partial<NivMatChapitre>;
  createForm() {
    this.form = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required]],
      description: [''],
      nivMatId: [this.nivMatId, [Validators.required]],
      chapitreId: ['', [Validators.required]],
      locked: [true, [Validators.required]],
      enabled: [true, [Validators.required]],
    }) as FormGroup & Chapitre;
  }

  clrMediaModalOpen: boolean = false;
  openMediaModal(chapId: string) {
    this.chapitreId = chapId;
    this.clrMediaModalOpen = true;
  }

  closeMediaModal() {
    this.clrMediaModalOpen = false
    this.chapitreId = "";
  }

  chapitreId: string;
  mediaTypeId: string;
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

  goToAssignMedia() {
    this.router.navigate(['niveau/matiere/chapitre/mediaAssign/list/', this.nivId, this.nivMatId, this.mediaTypeId, this.chapitreId]);
  }


  assignChapire(element) {
    console.log("assignChapire element : ", element);
    const body: NivMatChapitre = {
      nivMatId: this.nivMatId,
      chapitreId: element._id,
      order: this.nivMatChapitres.data.length,
      locked: true,
      enabled: true,
    }
    this.nivMatChapitreService.create(body)
      .subscribe((res) => {
        this.nivMatChapitres.data.push({ ...res, name: element.name })
        this.nivMatChapitres = new MatTableDataSource(this.nivMatChapitres.data);
      },
        (err) => console.log(err)
      );
  }
}
