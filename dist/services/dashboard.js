"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DasboardQueris = void 0;
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
const database_1 = __importDefault(require("../database"));
class DasboardQueris {
    async fiveMostWanted() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON product.id = order_products.id ORDER BY quantity DESC LIMIT 5';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }
}
exports.DasboardQueris = DasboardQueris;
