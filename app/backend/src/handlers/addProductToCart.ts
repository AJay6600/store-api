import { Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';
import { Product } from '../models/products';

type AddProductToCartRequestBodyType = {
  productId: number;
  quantity: number;
};

export const AddProductToCart = async (
  request: AuthenticatedRequest<
    unknown,
    unknown,
    AddProductToCartRequestBodyType
  >,
  response: Response<ErrorMessageResponseType>
) => {
  const { productId, quantity } = request.body;

  try {
    if (!productId && !quantity) {
      throw new Error('Product id or quantity is missing');
    }

    /** Check that product is available or not */
    const isProductAvailable = Product.findByPk(productId);

    if (!isProductAvailable) {
      throw new Error('Product is not found');
    }

    /** Get the cart of user */
    const cartDetails = await Cart.findAll({
      where: { userId: request.userId },
    });

    if (cartDetails && Array.isArray(cartDetails) && cartDetails.length === 0) {
      throw new Error('Cart details are not found');
    }

    /** Add the product to cart */
    await CartItem.create({
      cartId: cartDetails[0].dataValues.id,
      productId,
      quantity,
    });

    response
      .status(200)
      .json({ message: 'Added product to cart successfully' });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
