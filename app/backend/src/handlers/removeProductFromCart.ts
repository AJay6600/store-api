import { Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';

export const RemoveProductFromCart = async (
  request: AuthenticatedRequest<{ productId: number }, unknown, unknown>,
  response: Response<ErrorMessageResponseType>
) => {
  const productId = request.params.productId;

  try {
    const productToDelete = await Product.findByPk(productId);

    if (!productToDelete) {
      throw new Error('Product is not found');
    }

    const usersCartDetails = await Cart.findAll({
      where: { userId: request.userId },
    });

    const cartDetails =
      usersCartDetails &&
      Array.isArray(usersCartDetails) &&
      usersCartDetails.length > 0
        ? usersCartDetails[0]
        : null;

    if (!cartDetails) {
      throw new Error('Cart is not available for user');
    }

    const cartItemDetails = await CartItem.findAll({
      where: {
        productId,
        cartId: cartDetails.dataValues.id,
      },
    });

    if (
      cartItemDetails &&
      Array.isArray(cartItemDetails) &&
      cartItemDetails.length === 0
    ) {
      throw new Error('Cart item not found');
    }

    await cartItemDetails[0].destroy();

    response.status(200).json({ message: 'Product removed successfully' });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
