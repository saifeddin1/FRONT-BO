import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CourseGetAllResult, CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';


@Component({
  selector: 'app-list-cours',
  templateUrl: './list-cours.component.html',
  styleUrls: ['./list-cours.component.css']
})
export class ListCoursComponent {

  nivId: string = "";
  nivMatId: string = "";
  chapId: string = "";

  displayedCourseColumns: string[] = [
    'name',
    'enabled',
    'action'
  ];

  constructor(
    private courseService: CourseService,
    private activatedRouter: ActivatedRoute,
    private _location: Location,
    private router: Router
  ) {
    this.nivId = this.activatedRouter.snapshot.params['nivId'];
    this.nivMatId = this.activatedRouter.snapshot.params['nivMatId'];
    this.chapId = this.activatedRouter.snapshot.params['chapId'];
    if (!this.nivId || !this.nivMatId || !this.chapId) this._location.back();
    this.getCourse();
  }

  courses: MatTableDataSource<Course> = new MatTableDataSource<Course>();
  data: CourseGetAllResult
  getCourse() {
    this.courseService.getAllByChapId(this.nivId, this.nivMatId, this.chapId)
      .subscribe((res: CourseGetAllResult) => {
        console.log("res : ", res);
        if (res) {
          this.data = res;
          console.log("this.data :", this.data);

          this.courses = new MatTableDataSource<Course>(res.courses.sort((a, b) => a.order - b.order));
          console.log("this.chapitres :", this.courses.data);
        }
      }, error => {
        console.error("error :", error);
      })
  }

  addCourse() {
    this.router.navigate(['course/create/', this.nivId, this.nivMatId, this.chapId]);
  }
  editCourse(courseId: string) {
    this.router.navigate(['course/create/', this.nivId, this.nivMatId, this.chapId, courseId]);
  }
  deleteCourse(courseId: string, index: string) { }
  dropCourse(event: CdkDragDrop<Course[]>) {
    const previousIndex = this.courses.data.findIndex(row => row === event.item.data);
    moveItemInArray(this.courses.data, previousIndex, event.currentIndex);
    this.courses.data = this.courses.data.map((item: Course, index: number) => ({ ...item, order: index }));
    const courses = { data: this.courses.data.map(x => ({ _id: x._id, order: x.order })) }
    this.courseService.editOrders(courses)
      .subscribe((res) => {
        console.log("this.dataSource.data :", this.courses.data);
      }, error => {
        console.error("error :", error);
      })
  }
}