"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
// import { verifyAuthToken } from './usersStore';
const store = new products_1.ProductStore();
const index = async (_req, res) => {
    const result = await store.index();
    res.json(result);
};
const show = async (req, res) => {
    const result = await store.show(req.params.id);
    res.json(result);
};
const create = async (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    };
    const result = await store.create(product);
    res.json(result);
};
const destroy = async (req, res) => {
    const result = await store.delete(req.params.id);
    res.json(result);
};
const verifyId = async (req, res, next) => {
    try {
        const results = await store.index();
        const existingId = results.filter((result) => result.id ===
            parseInt(req.params.id, 10));
        if (existingId.length) {
            next();
        }
        else {
            throw new Error();
        }
    }
    catch (error) {
        res.status(401);
        res.json(error);
    }
};
const verifyProduct = async (req, res, next) => {
    try {
        if (req.body.name && req.body.price && req.body.category) {
            next();
        }
        else {
            throw new Error();
        }
    }
    catch (error) {
        res.status(401);
        res.json(error);
    }
};
const productsRoutes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', verifyId, show);
    app.post('/products', verifyProduct, create);
    app.delete('/products/:id', verifyId, destroy);
};
exports.default = productsRoutes;
