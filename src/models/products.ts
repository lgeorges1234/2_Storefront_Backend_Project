/* eslint-disable class-methods-use-this */
import client from '../database';

export type Product = {
  id?: Number;
  name: String;
  price: Number;
  category?: String;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get product ${id}. Error: ${error}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not add new product ${product.name}.Error: ${error}`
      );
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM products WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete product ${id}. Error: ${error}`);
    }
  }
}
