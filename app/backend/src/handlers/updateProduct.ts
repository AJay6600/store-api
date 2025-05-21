import { Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { ProductDetailsType } from '../utils/types/ProductDetailsType';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';

type UpdateProductRequestBodyType = Pick<
  ProductDetailsType,
  'title' | 'price' | 'imageUrl' | 'description'
>;

export const UpdateProduct = async (
  request: AuthenticatedRequest<
    { productId: number },
    unknown,
    UpdateProductRequestBodyType
  >,
  response: Response<ProductDetailsType | ErrorMessageResponseType>
) => {
  const productId = request.params.productId;

  const { title, price, imageUrl, description } = request.body;

  try {
    if (!title || !price || !imageUrl || !description) {
      throw new Error('Product details to update are not provided');
    }

    const productToUpdate = await Product.findByPk(productId);

    if (!productToUpdate) {
      throw new Error('Product not found');
    }

    productToUpdate.set('title', title);
    productToUpdate.set('price', price);
    productToUpdate.set('imageUrl', imageUrl);
    productToUpdate.set('description', description);

    if (productToUpdate.dataValues.userId !== request.userId) {
      productToUpdate.set('description', description);
    }

    const updateProductResult = await productToUpdate.save();

    response.status(200).json(updateProductResult.dataValues);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
