"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
/* eslint-disable class-methods-use-this */
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async index() {
        try {
            const sql = 'SELECT * FROM orders';
            const conn = await database_1.default.connect();
            const indexResult = await conn.query(sql);
            conn.release();
            return indexResult.rows;
        }
        catch (error) {
            throw new Error(`Could not get orders. Error: ${error}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const conn = await database_1.default.connect();
            const showResult = await conn.query(sql, [id]);
            conn.release();
            return showResult.rows[0];
        }
        catch (error) {
            throw new Error(`Could not get order ${id}. Error: ${error}`);
        }
    }
    async create(order) {
        try {
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
            const conn = await database_1.default.connect();
            const createResult = await conn.query(sql, [order.status, order.user_id]);
            conn.release();
            return createResult.rows[0];
        }
        catch (error) {
            throw new Error(`Could not add new order. Error: ${error}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            const conn = await database_1.default.connect();
            const deleteResult = await conn.query(sql, [id]);
            conn.release();
            return deleteResult.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete order ${id}. Error: ${error}`);
        }
    }
    async addProduct(orderProducts) {
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                orderProducts.quantity,
                orderProducts.order_id,
                orderProducts.product_id,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not add product ${orderProducts.product_id} to order ${orderProducts.order_id}: Error ${error}`);
        }
    }
    async indexProduct() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM order_products';
            const result = await conn.query(sql);
            conn.release();
            console.log(`indexProduct return :`);
            console.log(result.rows);
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get products from order_products: Error ${error}`);
        }
    }
    async editProduct(orderId) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM order_products WHERE order_id=($1)';
            const result = await conn.query(sql, [orderId]);
            conn.release();
            console.log(`editProduct return :`);
            console.log(result.rows);
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get products from order ${orderId}: Error ${error}`);
        }
    }
    async updateProduct(orderProducts) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'UPDATE order_products SET quantity=($1) WHERE order_id=($2) AND product_id=($3) RETURNING *';
            const result = await conn.query(sql, [
                orderProducts.quantity,
                orderProducts.order_id,
                orderProducts.product_id,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update product ${orderProducts.product_id} to order ${orderProducts.order_id}: Error ${error}`);
        }
    }
    async removeProduct(orderId, productId) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *';
            const result = await conn.query(sql, [orderId, productId]);
            conn.release();
            console.log(`removeProduct return :`);
            console.log(result.rows[0]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not remove product ${productId} to order ${orderId}: Error ${error}`);
        }
    }
}
exports.OrderStore = OrderStore;
