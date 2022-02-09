/* eslint-disable class-methods-use-this */
import client from '../database';

export type Order = {
  id?: Number;
  status: String;
  user_id: String;
};

export type OrderProducts = {
  id?: Number;
  quantity: Number;
  order_id: String;
  product_id: String;
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
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [order.status, order.user_id]);
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

  async addProduct(orderProducts: OrderProducts): Promise<OrderProducts> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [
        orderProducts.quantity,
        orderProducts.order_id,
        orderProducts.product_id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not add product ${orderProducts.product_id} to order ${orderProducts.order_id}: Error ${error}`
      );
    }
  }

  async editProduct(orderProducts: OrderProducts): Promise<OrderProducts[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM order_products WHERE order_id=($1)';
      const result = await conn.query(sql, [orderProducts.order_id]);
      return result.rows;
    } catch (error) {
      throw new Error(
        `Could not get products from ${orderProducts.product_id} to order ${orderProducts.order_id}: Error ${error}`
      );
    }
  }

  async updateProduct(orderProducts: OrderProducts): Promise<OrderProducts> {
    try {
      const conn = await client.connect();
      const sql = 'UPDATE order_products SET quantity=($1) WHERE order_id=($2)';
      const result = await conn.query(sql, [
        orderProducts.quantity,
        orderProducts.order_id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update product ${orderProducts.product_id} to order ${orderProducts.order_id}: Error ${error}`
      );
    }
  }

  async removeProduct(orderProducts: OrderProducts): Promise<OrderProducts> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM order_products WHERE order_id=($1)';
      const result = await conn.query(sql, [orderProducts.order_id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not remove product ${orderProducts.product_id} to order ${orderProducts.order_id}: Error ${error}`
      );
    }
  }
}
