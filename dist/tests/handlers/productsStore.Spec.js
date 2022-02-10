"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const request = (0, supertest_1.default)(server_1.default);
let product;
let noProduct;
let user;
let token;
let createResponse;
describe('productsRoutes', () => {
    beforeAll(async () => {
        product = {
            name: 'Twingo',
            price: 12000,
            category: 'car',
        };
        noProduct = {
            surname: 'Tintin',
            price: 12000,
            category: 'car',
        };
        user = {
            firstname: 'Jean-Claude',
            lastname: 'Van Damme',
            password_digest: 'kickboxer',
        };
        const createUserResponse = await request
            .post('/users')
            .send(user)
            .set('Accept', 'application/json');
        token = createUserResponse.body;
    });
    afterAll(async () => {
        const indexUserResponse = await request.get('/users').set({
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
        });
        await request.delete(`/users/${indexUserResponse.body[0].id}`).set({
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
        });
    });
    describe('CREATE POST /products', () => {
        it('wrong product settings should return an error', async () => {
            const createErrorResponse = await request
                .post('/products')
                .send(noProduct)
                .set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(createErrorResponse.status).toBe(401);
            expect(createErrorResponse.error).toBeTruthy;
        });
        it('correct product settings should return a new created product', async () => {
            createResponse = await request
                .post('/products')
                .send(product)
                .set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(createResponse.status).toBe(200);
            expect(createResponse.body).toEqual({
                id: createResponse.body.id,
                name: product.name,
                price: product.price,
                category: product.category,
            });
        });
        it('correct product settings with no jwt token should return an error', async () => {
            const createErrorResponse = await request
                .post('/products')
                .send(product)
                .set('Accept', 'application/json');
            expect(createErrorResponse.status).toBe(401);
            expect(createErrorResponse.error).toBeTruthy;
        });
    });
    describe('EDIT GET /products', () => {
        it('should return all created products', async () => {
            const indexResponse = await request
                .get('/products')
                .set('Accept', 'application/json');
            expect(indexResponse.status).toBe(200);
            expect(indexResponse.body).toEqual([
                {
                    id: createResponse.body.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                },
            ]);
        });
    });
    describe('SHOW GET /products/{id}', () => {
        it('wrong product id number should return an error', async () => {
            const showErrorResponse = await request.get(`/products/56`);
            expect(showErrorResponse.status).toBe(401);
            expect(showErrorResponse.error).toBeTruthy;
        });
        it('correct product id number should return the product', async () => {
            const showResponse = await request.get(`/products/${createResponse.body.id}`);
            expect(showResponse.status).toBe(200);
            expect(showResponse.body).toEqual({
                id: createResponse.body.id,
                name: product.name,
                price: product.price,
                category: product.category,
            });
        });
    });
    describe('Delete DELETE /products/{id}', () => {
        it('wrong product id number should return an error', async () => {
            const deleteErrorResponse = await request.delete(`/products/56`);
            expect(deleteErrorResponse.status).toBe(401);
            expect(deleteErrorResponse.error).toBeTruthy;
        });
        it('correct product id number should delete the product', async () => {
            const deleteResponse = await request
                .delete(`/products/${createResponse.body.id}`)
                .set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            const indexResponse = await request
                .get('/products')
                .set('Accept', 'application/json');
            expect(deleteResponse.status).toBe(200);
            expect(indexResponse.body).toEqual([]);
        });
    });
});
