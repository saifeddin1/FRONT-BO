export interface InterviewTest {
  title: string;
  url: string;
  description: string;
}

export interface Interview {
  _id?: string;
  userId?: string;
  status: string;
  date: Date;
  title: string;
  files: File;
  test?: InterviewTest;
}
