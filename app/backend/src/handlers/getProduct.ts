import { Request, Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { ProductDetailsType } from '../utils/types/ProductDetailsType';

export const GetProduct = async (
  request: Request<{ productId: number }, unknown, unknown>,
  response: Response<ProductDetailsType[] | ErrorMessageResponseType>
) => {
  const productId = request.params.productId;

  try {
    const getProductResult = await Product.findAll({
      where: { id: productId },
    });

    if (
      getProductResult &&
      Array.isArray(getProductResult) &&
      getProductResult.length === 0
    ) {
      throw new Error('Product not found');
    }

    response.status(200).json(getProductResult[0].dataValues);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
