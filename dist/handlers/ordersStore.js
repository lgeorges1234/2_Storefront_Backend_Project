"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
// import {verifyAuthToken } from './usersStore';
const store = new orders_1.OrderStore();
const index = async (_req, res) => {
    const result = await store.index();
    res.json(result);
};
const show = async (req, res) => {
    console.log(req.params);
    const result = await store.show(req.params.id);
    res.json(result);
};
const create = async (req, res) => {
    console.log(req.body);
    const order = {
        status: req.body.status,
        user_id: req.body.user_id,
    };
    const result = await store.create(order);
    res.json(result);
};
const destroy = async (req, res) => {
    console.log(req.params);
    const result = await store.delete(req.params.id);
    res.json(result);
};
const addProduct = async (req, res) => {
    const orderProducts = {
        order_id: req.params.id,
        product_id: req.params.product_id,
        quantity: parseInt(req.params.quantity, 10),
    };
    try {
        const addedProduct = await store.addProduct(orderProducts);
        res.json(addedProduct);
    }
    catch (error) {
        res.status(400);
        res.json(error);
    }
};
const ordersRoutes = (app) => {
    app.get('/orders', index);
    app.get('/orders/{:id}', show);
    app.post('/orders', create);
    app.delete('/orders/{:id}', destroy);
    // add product to an order
    app.post('/orders/{:id}/products', addProduct);
};
exports.default = ordersRoutes;
