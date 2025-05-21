import { Response, Request } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { ProductDetailsType } from '../utils/types/ProductDetailsType';

export const GetAllProduct = async (
  request: Request,
  response: Response<ProductDetailsType[] | ErrorMessageResponseType>
) => {
  try {
    const getAllProductResult = await Product.findAll();

    const allProductData = getAllProductResult.map(
      (product) => product.dataValues
    );

    response.status(200).json(allProductData);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
