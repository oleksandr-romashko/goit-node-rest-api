import { Sequelize } from "sequelize";

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DIALECT,
} = process.env;

const sequelize = new Sequelize({
  host: DATABASE_HOST,
  port: DATABASE_PORT || "5432",
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  dialect: DATABASE_DIALECT,
  dialectOptions: {
    ssl: true,
  },
});

export default sequelize;
