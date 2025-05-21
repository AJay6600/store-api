import { Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';

export const DeleteProduct = async (
  request: AuthenticatedRequest<{ productId: number }, unknown, unknown>,
  response: Response<ErrorMessageResponseType>
) => {
  const productId = request.params.productId;

  try {
    const productToDelete = await Product.findByPk(productId);

    if (!productToDelete) {
      throw new Error('Product is not found');
    }

    await productToDelete.destroy();

    response.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
