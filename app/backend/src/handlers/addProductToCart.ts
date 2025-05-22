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
    const isProductAvailable = await Product.findByPk(productId);

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

    /** Existing product in cart */
    const existingProductInCart = await CartItem.findAll({
      where: { cartId: cartDetails[0].dataValues.id, productId },
    });

    /**
     * When product is already in the cart then only change the quantity of product
     * When new product is in cart then directly add the product in cart
     */
    if (
      existingProductInCart &&
      Array.isArray(existingProductInCart) &&
      existingProductInCart.length > 0
    ) {
      existingProductInCart[0].set(
        'quantity',
        existingProductInCart[0].dataValues.quantity + quantity
      );
      await existingProductInCart[0].save();
    } else {
      /** Add the product to cart */
      await CartItem.create({
        cartId: cartDetails[0].dataValues.id,
        productId,
        quantity,
      });
    }

    response
      .status(200)
      .json({ message: 'Added product to cart successfully' });
  } catch (err) {
    response.status(400).json({ message: err.message });
  }
};
