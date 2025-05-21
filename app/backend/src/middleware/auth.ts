import { Response, NextFunction } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';
import { User } from '../models/user';

export const auth = async (
  request: AuthenticatedRequest,
  response: Response<ErrorMessageResponseType>,
  next: NextFunction
) => {
  const authHeader = request.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response
      .status(401)
      .json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded['userId']);

    if (!user) {
      throw new Error('User not found');
    }

    request.userId = decoded['userId'];

    next();
  } catch (err) {
    return response.status(401).json({ message: err.message });
  }
};
