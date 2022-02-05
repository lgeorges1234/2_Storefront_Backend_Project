/* eslint-disable class-methods-use-this */
import client from '../database';

export type Order = {
  id?: Number;
  status: String;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get order ${id}. Error: ${error}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (status) VALUES($1) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [order.status]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add new order. Error: ${error}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete order ${id}. Error: ${error}`);
    }
  }

  async addProduct(
    quantity: Number,
    orderId: String,
    productId: string
  ): Promise<Order> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [quantity, orderId, productId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: Error ${error}`
      );
    }
  }
}
