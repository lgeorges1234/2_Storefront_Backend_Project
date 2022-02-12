"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const store = new users_1.UserStore();
const index = async (_req, res) => {
    const result = await store.index();
    res.json(result);
};
const show = async (req, res) => {
    const result = await store.show(req.params.id);
    res.json(result);
};
const create = async (req, res) => {
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password_digest: req.body.password_digest,
    };
    try {
        const newUser = await store.create(user);
        const token = jsonwebtoken_1.default.sign({ user: newUser }, process.env.TOKEN_SECRET);
        res.json(token);
    }
    catch (error) {
        res.status(400);
        res.json(`${error}${user}`);
    }
};
const destroy = async (req, res) => {
    try {
        const result = await store.delete(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(400);
        res.json(`${error}`);
    }
};
const authenticate = async (req, res) => {
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password_digest: req.body.password_digest,
    };
    try {
        const authenticateUser = await store.authenticate(user);
        const token = jsonwebtoken_1.default.sign({ user: authenticateUser }, process.env.TOKEN_SECRET);
        res.json(token);
    }
    catch (error) {
        res.status(401);
        res.json({ error });
    }
};
const verifyUser = async (req, res, next) => {
    try {
        if (req.body.firstname && req.body.lastname && req.body.password_digest) {
            next();
        }
        else {
            throw new Error();
        }
    }
    catch (error) {
        res.status(401);
        res.json({ error });
    }
};
exports.verifyUser = verifyUser;
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
        res.json({ error });
    }
};
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (error) {
        res.status(401);
        res.json({ error });
    }
};
exports.verifyAuthToken = verifyAuthToken;
const usersRoutes = (app) => {
    app.get('/users', exports.verifyAuthToken, index);
    app.get('/users/:id', exports.verifyAuthToken, verifyId, show);
    app.post('/users', exports.verifyUser, create);
    app.delete('/users/:id', exports.verifyAuthToken, verifyId, destroy);
    app.post('/users/authenticate', exports.verifyUser, authenticate);
};
exports.default = usersRoutes;
