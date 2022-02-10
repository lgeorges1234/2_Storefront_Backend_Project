/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import client from '../database';

export class DasboardQueris {
  async fiveMostWanted(): Promise<
    { name: string; price: number; orderId: string }[]
  > {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_products ON product.id = order_products.id ORDER BY quantity DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }
}
