import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseFile } from 'src/app/models/course.model';
import { Chapitre } from 'src/app/pages/admin/niveau/chapitre.service';
import { PlyrComponent } from 'ngx-plyr';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { MediaType, MediaTypeService } from 'src/app/pages/admin/media/media-type.service';
import { MediaAssign, MediaAssignService } from 'src/app/pages/admin/niveau/list-assign-media/mediaAssign.service';
import { MediaReviewService } from 'src/app/services/mediaReview.service';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css']
})
export class ChaptersComponent implements OnInit {
  // Inputs
  @Input() nivMat: any;
  // Global Variables
  nivMatId: string = "";

  // get the component instance to have access to plyr instance
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;

  // or get it from plyrInit event
  player: Plyr;

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }

  chapTabType = "chapitres" //chapitres or enregistrements

  constructor(
    private activatedRouter: ActivatedRoute,
    private mediaTypeService: MediaTypeService,
    private mediaAssignService: MediaAssignService,
    private mediaReviewService: MediaReviewService
  ) {
    this.getPublicMediaTypes();
  }

  selectedTab: string = "course";
  selectedTabChanged(event: string) {
    console.log("event : ", event);
  }

  rating = {
    _id: "",
    disabled: false,
    id: 'rating',
    rate: 0,
    comment: ""
  }


  onChangeRating(event, type) {
    console.log("event :", event);
    this.confirmRating(type)
  }

  confirmRating(type) {
    const Swal = require('sweetalert2')
    Swal.fire({
      title: 'Avis',
      input: 'text',
      inputLabel: "Commentaire",
      inputPlaceholder: 'Tapez un commentaire (facultatif)',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: "Annuler",
      confirmButtonText: 'Valider',
      showLoaderOnConfirm: true,
      preConfirm: (comment?: string) => {
        this.createUserReview(comment, type)
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
      .then((result) => {
        if (result.isDismissed) {
          this.rating.rate = 0;
        }
        if (result.isConfirmed) {
          Swal.fire(
            'Merci!',
            'Avis soumis avec succès!',
            'success'
          )
        }
      })
  }

  mediaTypes: Partial<MediaType>[] = []
  getPublicMediaTypes() {
    this.mediaTypeService.getPublicMediaTypes()
      .subscribe((res: MediaType[]) => {
        console.log("MediaType : ", res);
        this.mediaTypes = res.map(x => ({ _id: x._id, name: x.name, nameSingulier: x.nameSingulier }))
      }, error => {
        console.error("error :", error);
      })
  }

  assignMedias: MediaAssign[];
  getChapitreMedias() {
    this.mediaAssignService.findByAssignIdForStudent(this.selectedChapitre._id, this.selectedMediaType._id, true)
      .subscribe((res: MediaAssign[]) => {
        this.assignMedias = res
      }, error => {
        console.error("error :", error);
      })
  }

  assignRecordMedias: MediaAssign[];
  getRecordMedias() {
    this.mediaAssignService.findByAssignIdForStudent(this.nivMatId, null)
      .subscribe((res: MediaAssign[]) => {
        this.assignRecordMedias = res
      }, error => {
        console.error("error :", error);
      })
  }

  ngOnInit(): void {
    this.activatedRouter.params
      .subscribe(routeParams => {
        this.nivMatId = routeParams.nivMatId
        this.selectedChapitre = null;
        this.initializeVars()
        this.getRecordMedias();
      });
  }

  initializeVars() {
    this.selectedChapitre = null;
    this.selectedMediaType = null;
    this.selectedAssignMedia = null;
    this.selectedRecordAssignMedia = null;
    this.assignMedias = [];
    this.assignMediaFiles = new MatTableDataSource<CourseFile>();
  }

  selectedChapitre: Chapitre = null;
  selectChapitre(chapitre) {
    this.selectedChapitre = chapitre
    console.log("Chapitre", chapitre);
  }

  selectedMediaType: { _id: string, name: string, nameSingulier: string } = null;
  selectMediaType(mediaType: { _id: string, name: string, nameSingulier: string }) {
    console.log("type : ", mediaType);
    this.selectedMediaType = mediaType;
    this.getChapitreMedias()
  }

  displayedFileColumns: string[] = ['name', 'action'];
  assignMediaFiles: MatTableDataSource<CourseFile> = new MatTableDataSource<CourseFile>();
  selectedAssignMedia: MediaAssign = null;
  selectAssignMedia(course: MediaAssign) {
    // Save Selected Assign Media
    this.selectedAssignMedia = course;

    if (this.selectedAssignMedia
      && this.selectedAssignMedia.files
      && this.selectedAssignMedia.files.length) {
      this.assignMediaFiles = new MatTableDataSource<CourseFile>(this.selectedAssignMedia.files);
    }
    this.getUserReview("course")
    console.log("Course :", course)
  }

  selectedRecordAssignMedia: MediaAssign = null;
  selectRecordAssignMedia(record: MediaAssign) {
    console.log("selectRecordAssignMedia :", record);

    // Save Selected Assign Media
    this.selectedRecordAssignMedia = record;
    this.getUserReview("record")
  }

  getUserReview(type: string) {
    console.log("getUserReview :", type);
    var selectedAssignVar: string = ""
    switch (type) {
      case "record":
        selectedAssignVar = this.selectedRecordAssignMedia._id
        break;
      case "course":
        selectedAssignVar = this.selectedAssignMedia._id
        break;
    }
    this.rating = {
      id: "rating",
      rate: 0,
      comment: "",
      disabled: false,
      _id: ''
    };
    this.mediaReviewService.findByMediaReviewId(selectedAssignVar)
      .subscribe(res => {
        console.log("UserReview Res :", res);
        if (res) {
          if (!res) {
            res["rate"] = 0;
            res["comment"] = "";
          }
          this.rating = {
            id: "rating",
            rate: res.rate,
            comment: res.comment,
            disabled: true,
            _id: res._id
          };
        }
      }, error => {
        console.error("error : ", error);
      })
  }

  createUserReview(comment, type: string) {
    var selectedAssignVar: string = ""
    switch (type) {
      case "record":
        selectedAssignVar = this.selectedRecordAssignMedia._id
        break;
      case "course":
        selectedAssignVar = this.selectedAssignMedia._id
        break;
    }

    const body = {
      mediaAssignId: selectedAssignVar,
      rate: this.rating.rate,
      comment: comment
    }
    this.mediaReviewService.create(body)
      .subscribe(res => {
        console.log("UserReview Res :", res);
        if (res) {
          this.rating = {
            id: "rating",
            rate: res.rate,
            comment: comment,
            disabled: true,
            _id: res._id
          };
        }
      }, error => {
        console.error("error : ", error);
        const Swal = require('sweetalert2')
        Swal.showValidationMessage(
          `Quelque chose s'est mal passé !`
        )
      })
  }

  openFile(imgUrl: string) {
    if (imgUrl) {
      const url = `${environment.LmsApiUrl}/api/media/documents/${imgUrl}`; // TODO REMOVE LOCALHOST FROM PRODUCTION BUILD
      console.log("url :", url);
      window.open(url);
    }
  }

  getEmptyAssignedMedia(name) {
    if (name) {
      const firstChar = name.charAt(0).toLowerCase()
      name = firstChar + name.slice(1) + " ...";
      if (['a', 'e', 'i', 'o', 'u', 'y'].includes(firstChar))
        return "Ce chapitre n'a pas d'" + name;
      return "Ce chapitre n'a pas de " + name;
    } else {
      return "Section Vide..."
    }
  }
}
