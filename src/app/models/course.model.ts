/**
 * Course Frontend model
 *  - synchronous with `~/backend/models/course.model.js`
 *
 * @property {String} _id mongoDB ObjectId
 */
export interface CourseFile {
  _id: string;
  name: string;
  title: string;
  type: string;
  order: number;
  locked: boolean;
}
export interface Course {
  _id: string;
  name: string;
  videoUrl: string;
  chapitreId: string;
  niveauId: string;
  nivMatId: string;
  students: string[];
  teachers: string[];
  description: string;
  tags: string;
  level: string;
  img: string;
  files: CourseFile[];
  reviews: object[];
  surveyRequest: boolean;
  assessments: string[];
  lectures: [{ id: string; title: string, date: Date }];
  instructorReview: [{ _id: string; surveyAnswers: string[] }];
  order: number;
  enabled: boolean;
  video_id?: string;
}
