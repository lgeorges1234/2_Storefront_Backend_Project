"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const usersStore_1 = require("./usersStore");
const store = new products_1.ProductStore();
const index = async (_req, res) => {
    try {
        const result = await store.index();
        res.json(result);
    }
    catch (error) {
        res.status(401).json(`${error}`);
    }
};
const show = async (req, res) => {
    try {
        const result = await store.show(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(401).json(`${error}`);
    }
};
const create = async (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    };
    try {
        const result = await store.create(product);
        res.json(result);
    }
    catch (error) {
        res.status(400).json(`${error}${product}`);
    }
};
const destroy = async (req, res) => {
    try {
        const result = await store.delete(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(401);
        res.json(error);
    }
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
            throw new Error('Product settings');
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
    app.post('/products', usersStore_1.verifyAuthToken, verifyProduct, create);
    app.delete('/products/:id', usersStore_1.verifyAuthToken, verifyId, destroy);
};
exports.default = productsRoutes;
