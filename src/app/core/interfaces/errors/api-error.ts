export interface ApiError {
  title: string;
  status: number;
  errors: { [key: string]: string[] };
  detail: string;
  type: string;
  traceId: string;
}
