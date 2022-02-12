interface Profile {
  _id?: string;
  image?: string;
  position?: string;
  proEmail?: string;
  phone?: number;
  address?: string;
  jobType?: string;
  workFrom?: string;
  seniorityLevel?: string;
}

export interface File {
  _id?: string;
  userRef: string;
  userId: string;
  timeOffBalance: number;
  profile: Profile;
}
