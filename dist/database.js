"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST_DEV, POSTGRES_DB_DEV, POSTGRES_USER_DEV, POSTGRES_PASSWORD_DEV, PORT_DEV, POSTGRES_HOST_TEST, POSTGRES_DB_TEST, POSTGRES_USER_TEST, POSTGRES_PASSWORD_TEST, PORT_TEST, ENV, } = process.env;
// eslint-disable-next-line import/no-mutable-exports
let client = new pg_1.Pool();
console.log(`ENV var: ${ENV}`);
if (ENV === 'test') {
    client = new pg_1.Pool({
        host: POSTGRES_HOST_TEST,
        database: POSTGRES_DB_TEST,
        user: POSTGRES_USER_TEST,
        password: POSTGRES_PASSWORD_TEST,
        port: PORT_DEV,
    });
}
if (ENV === 'dev') {
    client = new pg_1.Pool({
        host: POSTGRES_HOST_DEV,
        database: POSTGRES_DB_DEV,
        user: POSTGRES_USER_DEV,
        password: POSTGRES_PASSWORD_DEV,
        port: PORT_TEST,
    });
}
exports.default = client;
