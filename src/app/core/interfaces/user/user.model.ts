import { BaseResponse } from '../base-response.model';

export interface User extends BaseResponse {
  lastName: string;
  firstName: string;
  email: string;
  emailConfirmed: boolean;
  photoPath?: string | null;
  balance: number;
  role: string;
}
