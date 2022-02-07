/**
 * User Frontend model
 *  - synchronous with `~/backend/models/user.model.js`
 */
export interface User {
  _id: string;
  password: string;
  email: string;
  phone: string;
  username: string;
  type: string;
  studentNiveauId: string;
  studentOffreId: string;
  profile: {
    fullName: string;
    phone: string;
    linkedIn: string;
    facebook: string;
  };
  permissions: {
    chapitre: boolean;
    media: boolean;
    seance: boolean;
    homework: boolean;
  };
  credit: number;
  chats: string[];
}
