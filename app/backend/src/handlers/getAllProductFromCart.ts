import { Response } from 'express';
import { ErrorMessageResponseType } from '../utils/types/ErrorMessageResponseType';
import { Product } from '../models/products';
import { ProductDetailsType } from '../utils/types/ProductDetailsType';
import { AuthenticatedRequest } from '../utils/types/AuthenticatedRequest';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartItem';

type GetAllProductFromCartResponseType = {
  product: ProductDetailsType;
  quantity: number;
};

export const GetAllProductFromCart = async (
  request: AuthenticatedRequest,
  response: Response<
    GetAllProductFromCartResponseType[] | ErrorMessageResponseType
  >
) => {
  try {
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

    const cartItems = await CartItem.findAll({
      where: { cartId: cartDetails.dataValues.id },
    });

    const cartProductDetails = await Promise.all(
      cartItems.map(async (item) => {
        const productDetails = await Product.findByPk(
          item.dataValues.productId
        );
        return {
          product: productDetails.dataValues,
          quantity: item.dataValues.quantity,
        } as GetAllProductFromCartResponseType;
      })
    );
    response.status(200).json(cartProductDetails);
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
