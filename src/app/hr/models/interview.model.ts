export interface Interview {
  _id?: string;
  userId?: string;
  date: Date;
  title: string;
  files: File;
  test?: Array<Object>;
}
