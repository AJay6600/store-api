import { Request } from 'express';

export type AuthenticatedRequest<
  Params = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  userId: number;
};
