import { Request, Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

type SignUpRequestBodyType = {
  email: string;
  password: string;
};

type SignUpResponseType = {
  token: string;
  userId: number;
};

export const SignUp = async (
  request: Request<unknown, unknown, SignUpRequestBodyType>,
  response: Response<SignUpResponseType | ErrorMessageResponseType>
) => {
  const { email, password } = request.body;

  try {
    if (!email) {
      throw new Error('Email is required');
    }

    if (!password) {
      throw Error('Password is required');
    }

    /** Is existing user available with same email */
    const existingUser = await User.findAll({ where: { email } });

    if (existingUser && existingUser.length > 0) {
      return response.status(409).json({ message: 'Email is already in use' });
    }

    /** hashed password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /** create the user */
    const createUserResult = await User.create({
      email,
      password: hashedPassword,
    });

    const userId = createUserResult.dataValues.id;

    /** Create jwt token */
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    response.status(200).json({ token, userId });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
