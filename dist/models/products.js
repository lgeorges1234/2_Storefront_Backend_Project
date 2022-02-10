"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
/* eslint-disable class-methods-use-this */
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async index() {
        try {
            const sql = 'SELECT * FROM products';
            const conn = await database_1.default.connect();
            const indexResult = await conn.query(sql);
            conn.release();
            return indexResult.rows;
        }
        catch (error) {
            throw new Error(`Could not get products. Error: ${error}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const conn = await database_1.default.connect();
            const showResult = await conn.query(sql, [id]);
            conn.release();
            return showResult.rows[0];
        }
        catch (error) {
            throw new Error(`Could not get product ${id}. Error: ${error}`);
        }
    }
    async create(product) {
        try {
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const createResult = await conn.query(sql, [
                product.name,
                product.price,
                product.category,
            ]);
            conn.release();
            return createResult.rows[0];
        }
        catch (error) {
            throw new Error(`Could not add new product ${product.name}.Error: ${error}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM products WHERE id=($1)';
            const deleteResult = await conn.query(sql, [id]);
            conn.release();
            return deleteResult.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete product ${id}. Error: ${error}`);
        }
    }
}
exports.ProductStore = ProductStore;
