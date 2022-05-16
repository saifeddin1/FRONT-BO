interface Profile {
  _id?: string;
  image?: string;
  position?: string;
  fullname: string;
  proEmail?: string;
  phone: string;
  address?: string;
  jobType?: string;
  workFrom?: string;
  seniorityLevel?: string;
  description?: string;
  birthdate?: Date;
}

export interface File {
  createdAt?: any;
  _id?: string;
  userRef: string;
  userId: string;
  timeOffBalance: string;
  profile: Profile;
}
