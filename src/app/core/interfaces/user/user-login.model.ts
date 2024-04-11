import { Token } from '../token/token';
import { User } from './user.model';

export interface UserLogin {
  payload: User;
  bearerToken: Token;
}
