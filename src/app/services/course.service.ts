import { Course } from './../models/course.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Assessment } from './../models/assessment.model';
import { environment } from 'src/environments/environment';
import { Chapitre } from '../pages/admin/niveau/chapitre.service';

export interface CourseGetAllResult {
  nivMat: {
    _id: string;
    name: string;
  };
  chapitre: Chapitre;
  courses: Course[];
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) { }

  /**
  * GET all
  */
  getAllForStudents(nivId: string, nivMatId: string, chapId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.LmsApiUrl}/api/course/getAllForStudents/${nivId}/${nivMatId}/${chapId}`);
  }
  
  /**
  * GET all courses count
  */
   getCoursesCountForStudents(nivId: string, nivMatId: string): Observable<number> {
    return this.http.get<number>(`${environment.LmsApiUrl}/api/course/getCoursesCountForStudents/${nivId}/${nivMatId}`);
  }

  /**
  * GET all
  */
  getAllByChapId(nivId: string, nivMatId: string, chapId: string): Observable<CourseGetAllResult> {
    return this.http.get<CourseGetAllResult>(`${environment.LmsApiUrl}/api/course/getAll/${nivId}/${nivMatId}/${chapId}`);
  }

  /**
  * Edit Courses Orders
  * @param {Partial<any>}    data to be updated
  * @param {string} id    id
  */
  editOrders(data: { data: { _id: string, order: number }[] }): Observable<void> {
    return this.http.put<void>(`${environment.LmsApiUrl}/api/course/editOrders`, data);
  }


  /**
   * POST new course
   * @param {any}    course the newly created course
   * @param {string} _id    id of the teacher
   */
  postNewCourse(course: any, _id: string): Observable<Course> {
    const { name, description, level, tags, chapitreId, videoUrl, niveauId, nivMatId } = course;
    return this.http.post<Course>(environment.LmsApiUrl + '/api/course/', {
      name,
      videoUrl,
      students: [],
      teachers: [_id],
      description,
      files: [],
      level,
      tags,
      // img,
      chapitreId,
      niveauId,
      nivMatId,
    });
  }

  /**
   * PUT update existing course
   * @param {any}     course    the new course information
   * @param {string}  courseId  id of the course
   */
  updateCourse(course: any): Observable<Course> {
    return this.http.put<Course>(`${environment.LmsApiUrl}/api/course/update`, {
      course,
    });
  }

  /**
   * POST uploading document to a course
   * @param {FormData} file     new file
   * @param {string}   courseId id of course
   */
  postNewFile(file: FormData, courseId: string) {
    return this.http.post(`${environment.LmsApiUrl}/api/course/${courseId}/upload`, file);
  }

  /**
   * POST uploading document to a course
   * @param {FormData} file     new file
   * @param {string}   courseId id of course
   */
  postNewAssessmentFile(file: FormData, assessmentId: string) {
    return this.http.post(
      `${environment.LmsApiUrl}/api/course/assessment/uploadAssessment/${assessmentId}`,
      file
    );
  }

  /**
   * PUT
   * @param {any} course the course that's requesting survey
   */
  requestSurvey(id: string): Observable<Course> {
    return this.http.put<Course>(`${environment.LmsApiUrl}/api/course/surveyRequest/${id}`, {});
  }

  /**
   * GET all documents for a course
   * @param {string} courseId id of course
   */
  getCourseFiles(courseId: string): Observable<any> {
    return this.http.get(`${environment.LmsApiUrl}/api/document/${courseId}`);
  }

  /**
   * GET courses by search query
   * @param {String} query the search query
   */
  search(query: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.LmsApiUrl}/api/course/search/${query}`);
  }

  /**
   * GET course image
   * @param {string} courseId id of course
   */
  getCourseImageId(courseId: string): Observable<any> {
    return this.http.get(`${environment.LmsApiUrl}/api/course/${courseId}/getCourseImage`);
  }

  /**
   * POST add course image to course
   * @param {FormData} file the course image
   * @param {string} courseId id of course
   */
  postCourseImage(file: FormData, courseId: string): Observable<Course> {
    return this.http.post<Course>(
      `${environment.LmsApiUrl}/api/course/${courseId}/uploadCourseImage`,
      file
    );
  }

  /**
   * GET all courses
   */
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.LmsApiUrl}/api/course`);
  }

  /**
   * GET single course given id
   * @param {string} _id id of course
   */
  getCourse(_id: string): Observable<Course> {
    return this.http.get<Course>(`${environment.LmsApiUrl}/api/course/${_id}`);
  }


  /**
   * DELETE drop student from course
   * @param {string} userId   id of user
   * @param {string} courseId id of course
   */
  dropACourse(userId: string, courseId: string): Observable<any> {
    return this.http.delete(`${environment.LmsApiUrl}/api/course/dropCourse/${courseId}/${userId}`);
  }

  /**
   * PUT student review in course
   * @param userId
   * @param courseId
   * @param courseReview
   * @param score
   * @param anon
   */
  addAReview(
    _id: string,
    courseId: string,
    courseReview: string,
    score: Number,
    anon: Boolean
  ): Observable<Course> {
    return this.http.put<Course>(`${environment.LmsApiUrl}/api/course/addReview`, {
      _id,
      courseId,
      courseReview,
      score,
      anon,
    });
  }

  /**
   * POST new assessment
   * @param {any}     assessment  the newly created assessment
   *
   */
  postNewAssessment(assessment: any): Observable<Assessment> {
    const { name, visibility, studentSubmission } = assessment;
    return this.http.post<Assessment>(`${environment.LmsApiUrl}/api/course/assessment`, {
      name,
      files: [],
      visibility,
      studentSubmission,
    });
  }

  /**
   *
   * @param courseId
   * @param assessmentId
   */
  postAssessmentCourse(
    courseId: string,
    assessmentId: string
  ): Observable<Course> {
    return this.http.put<Course>(environment.LmsApiUrl + '/api/course/assessment/addAssessment', {
      courseId,
      assessmentId,
    });
  }

  /**
   * DELETE assessment
   * @param {string} courseId id of user
   * @param {string} courseId id of course
   */
  deleteAssessment(courseId: string, assessmentId: string): Observable<any> {
    return this.http.delete(
      `${environment.LmsApiUrl}/api/course/assessment/deleteAssessment/${courseId}/${assessmentId}`
    );
  }

  // updateAssessment(
  //   files: FormData,
  //   assessment: any,
  //   assessmentId: string
  // ): Observable<Assessment> {
  //   const { name, visibility, studentSubmission } = assessment;
  //   return this.http.put<Assessment>(
  //     `${environment.LmsApiUrl}/api/course/assessment/updateAssessment`,
  //     {
  //       files,
  //       name,
  //       visibility,
  //       studentSubmission,
  //       assessmentId,
  //     }
  //   );
  // }

  // deleteFiles(assessmentId: string): Observable<Assessment> {
  //   return this.http.put<Assessment>(`${environment.LmsApiUrl}/api/course/assessment/deleteFiles`, {
  //     assessmentId,
  //   });
  // }

  /**
   * DELETE Course File
   * @param {string} fileId id of assessment
   */
  deleteCourseFile(fileId: string): Observable<any> {
    return this.http.delete(
      `${environment.LmsApiUrl}/api/course/documents/del/${fileId}`
    );
  }

  addSurvey(
    _id: string,
    courseId: string,
    surveyAnswers: string[]
  ): Observable<Course> {
    return this.http.put<Course>(`${environment.LmsApiUrl}/api/course/addSurvey`, {
      _id,
      courseId,
      surveyAnswers,
    });
  }

  /**
   * POST uploading document to a course
   * @param {FormData} file     new file
   * @param {string}   courseId id of course
   */
  postUploadLecture(video: FormData, courseId: string) {
    return this.http.post(`${environment.LmsApiUrl}/api/course/${courseId}/uploadLecture`, video);
  }

}
