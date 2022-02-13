"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const ordersStore_1 = __importDefault(require("./handlers/ordersStore"));
const productsStore_1 = __importDefault(require("./handlers/productsStore"));
const usersStore_1 = __importDefault(require("./handlers/usersStore"));
const dasboardStore_1 = __importDefault(require("./handlers/dasboardStore"));
const app = (0, express_1.default)();
const address = '127.0.0.1:3000';
app.use(body_parser_1.default.json());
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
(0, ordersStore_1.default)(app);
(0, productsStore_1.default)(app);
(0, usersStore_1.default)(app);
(0, dasboardStore_1.default)(app);
app.listen(3000, () => {
    console.log(`starting app on: ${address}`);
});
exports.default = app;
