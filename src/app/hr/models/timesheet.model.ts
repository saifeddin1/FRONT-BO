export interface Timesheet {
  _id?: string;
  date: Date;
  workingHours: number;
  note: string;
  userId: string;
}
