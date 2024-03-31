import {BaseResponse} from "../base-response.model";

export interface User extends BaseResponse{
 lastName:string;
 firstName:string;
 email:string;
photoPath?:string | null;
balance:number
 role:string;
}
