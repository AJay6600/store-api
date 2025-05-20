import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost', // or 'postgres' if running inside another container
  dialect: 'postgres',
  port: 5432,
});
