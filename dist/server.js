"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var ordersStore_1 = __importDefault(require("./handlers/ordersStore"));
var productsStore_1 = __importDefault(require("./handlers/productsStore"));
var usersStore_1 = __importDefault(require("./handlers/usersStore"));
var app = (0, express_1["default"])();
var address = '127.0.0.1:3000';
app.use(body_parser_1["default"].json());
app.get('/', function (_req, res) {
    res.send('Hello World!');
});
app.use(ordersStore_1["default"]);
app.use(productsStore_1["default"]);
app.use(usersStore_1["default"]);
app.listen(3000, function () {
    console.log("starting app on: ".concat(address));
});
