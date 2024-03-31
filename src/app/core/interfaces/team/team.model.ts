import {BaseResponse} from "../base-response.model";

export interface Team extends BaseResponse {
name:string;
photoUrl?:string | null;
}
