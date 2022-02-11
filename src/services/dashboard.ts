/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import client from '../database';

export class DasboardQueris {
  async fiveMostWanted(): Promise<
    { name: string; price: number; category: string; quantity: number }[]
  > {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT p.id, p.name, p.category, SUM(op.quantity) volume,COUNT(op.order_id) orders_placed FROM (products p INNER JOIN order_products op on p.id=op.product_id) GROUP BY p.id ORDER BY volume DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }
}
