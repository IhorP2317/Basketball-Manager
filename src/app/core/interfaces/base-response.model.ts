export interface BaseResponse {
  id: string;
  createdTimestamp: Date;
  modifiedTimestamp?: Date | null;
  createdBy: string;
  modifiedBy?: string | null;
}
