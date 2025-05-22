import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database';

export const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});
