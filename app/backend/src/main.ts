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

dotenv.config();

const app = express();

app.use(express.json());

app.get('/api', (_, res) => {
  res.json({ message: 'Hello Eumentis API' });
});

/** Add new product */
app.post('/api/add-product', AddProduct);
/** get all the product */
app.get('/api/products', GetAllProduct);
/** get single product */
app.get('/api/products/:productId', GetProduct);
/** Update the product  */
app.patch('/api/product/:productId', UpdateProduct);
/** Delete the product */
app.delete('/api/product/:productId', DeleteProduct);

/** sign up */
app.post('/api/user/sign-up', SignUp);

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL successfully.');

    User.hasMany(Product);
    Product.belongsTo(User, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await sequelize.sync();
    console.log('Synced all the models.');

    console.log(`Listening at http://localhost:${port}/api`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
server.on('error', console.error);
