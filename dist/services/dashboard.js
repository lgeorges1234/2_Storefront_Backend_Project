"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DasboardQueries = void 0;
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
const database_1 = __importDefault(require("../database"));
class DasboardQueries {
    async fiveMostWanted() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT p.name, p.category, SUM(op.quantity) volume,COUNT(op.order_id) orders_placed FROM (products p INNER JOIN order_products op on p.id=op.product_id) GROUP BY p.id ORDER BY volume DESC LIMIT 5';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }
    async productByCategory(category) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT category, name FROM products WHERE category=($1) GROUP BY category, name ORDER BY (name) DESC';
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`unable get products : ${err}`);
        }
    }
}
exports.DasboardQueries = DasboardQueries;
