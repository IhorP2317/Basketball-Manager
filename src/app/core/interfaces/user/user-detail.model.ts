import { BaseResponse } from '../base-response.model';

export interface UserDetail extends BaseResponse {
  lastName: string;
  firstName: string;
  email: string;
  balance: string;
  photoPath: string | null;
  role: string;
  emailConfirmed: string;
}
