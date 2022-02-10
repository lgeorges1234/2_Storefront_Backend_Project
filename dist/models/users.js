"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
/* eslint-disable class-methods-use-this */
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;
class UserStore {
    async index() {
        try {
            const sql = 'SELECT * FROM users';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not get users. Error: ${error}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not get user ${id}. Error: ${error}`);
        }
    }
    async create(user) {
        try {
            const sql = 'INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const hash = bcrypt_1.default.hashSync(user.password_digest + pepper, parseInt(saltRounds, 10));
            const result = await conn.query(sql, [
                user.firstname,
                user.lastname,
                hash,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not add new user. Error: ${error}`);
        }
    }
    async authenticate(user) {
        const sql = 'SELECT * FROM users WHERE lastname=($1)';
        const conn = await database_1.default.connect();
        const result = await conn.query(sql, [user.lastname]);
        conn.release();
        if (result.rows.length) {
            if (bcrypt_1.default.compareSync(user.password_digest + pepper, result.rows[0].password_digest)) {
                return result.rows[0];
            }
            throw new Error(`Authentication of  ${user.lastname} has not succeed.`);
        }
        throw new Error(`User ${user.lastname} does not exist.`);
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete user ${id}. Error: ${error}`);
        }
    }
}
exports.UserStore = UserStore;
