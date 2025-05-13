import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    // 필요한 추가 필드가 있으면 여기에
    // role?: string;
  };
}
