import { Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { ProductDetailsType } from '../utils/types/ProductDetailsType';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';

type AddProductRequestBodyType = Pick<
  ProductDetailsType,
  'title' | 'price' | 'imageUrl' | 'description'
>;

export const AddProduct = async (
  request: AuthenticatedRequest<unknown, unknown, AddProductRequestBodyType>,
  response: Response<ProductDetailsType | ErrorMessageResponseType>
) => {
  const { title, price, imageUrl, description } = request.body;

  try {
    const createProductResult = await Product.create({
      title,
      price,
      imageUrl,
      description,
      userId: request.userId,
    });

    response.status(200).json(createProductResult.dataValues);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
