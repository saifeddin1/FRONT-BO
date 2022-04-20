export interface Contract {
  _id?: string;
  contractType: string;
  hoursNumber: number;
  startDate: Date;
  endDate: Date;
  userId: string;
  timesheetType: string;
  salary: any;
}
