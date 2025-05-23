import express from 'express';
import { sequelize } from './utils/database';
import { Product } from './models/products';
import { User } from './models/user';
import { AddProduct } from './handlers/addProduct';
import { GetAllProduct } from './handlers/getAllProduct';
import { GetProduct } from './handlers/getProduct';
import { UpdateProduct } from './handlers/updateProduct';
import { DeleteProduct } from './handlers/deleteProduct';
import { SignUp } from './handlers/signUp';
import dotenv from 'dotenv';
import { auth } from './middleware/auth';
import { Cart } from './models/cart';
import { CartItem } from './models/cartItem';
import { AddProductToCart } from './handlers/addProductToCart';
import { GetAllProductFromCart } from './handlers/getAllProductFromCart';
import { RemoveProductFromCart } from './handlers/removeProductFromCart';

dotenv.config();

const app = express();

app.use(express.json());

User.hasMany(Product);
Product.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

User.hasOne(Cart);
Cart.belongsTo(User, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Cart.belongsToMany(Product, {
  through: CartItem,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Product.belongsToMany(Cart, {
  through: CartItem,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

app.get('/api', (_, res) => {
  res.json({ message: 'Hello Eumentis API' });
});

/** Add new product */
app.post('/api/add-product', auth, AddProduct);
/** get all the product */
app.get('/api/products', GetAllProduct);
/** get single product */
app.get('/api/products/:productId', GetProduct);
/** Update the product  */
app.patch('/api/product/:productId', auth, UpdateProduct);
/** Delete the product */
app.delete('/api/product/:productId', auth, DeleteProduct);

/** sign up */
app.post('/api/user/sign-up', SignUp);

/** Add product to cart */
app.post('/api/cart/add-product', auth, AddProductToCart);
/** Get All product from cart */
app.get('/api/cart/products', auth, GetAllProductFromCart);
/** Remove the product from cart */
app.delete('/api/cart/product/:productId', auth, RemoveProductFromCart);

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL successfully.');

    await sequelize.sync();
    console.log('Synced all the models.');

    console.log(`Listening at http://localhost:${port}/api`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
server.on('error', console.error);
