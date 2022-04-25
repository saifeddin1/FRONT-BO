export interface Timeoff {
  _id?: string;
  status?: string;
  startDateSpecs: {
    date: Date;
    from: string;
  };
  endDateSpecs: {
    date: Date;
    to: string;
  };
  // startDate: Date;
  // offDays: number;
  userId?: string;
}
