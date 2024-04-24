import { BaseResponse } from '../base-response.model';

export interface Award extends BaseResponse {
  name: string;
  date: Date;
  isIndividualAward: boolean;
}
