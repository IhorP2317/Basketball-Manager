export interface BaseResponse {
  id: string;
  createdTime: Date;
  modifiedTime?: Date | null;
  createdById: string;
  modifiedById?: string | null;
}
