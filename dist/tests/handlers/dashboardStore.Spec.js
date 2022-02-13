"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const products_1 = require("../../models/products");
const orders_1 = require("../../models/orders");
const enum_1 = __importDefault(require("../../utils/enum"));
const users_1 = require("../../models/users");
const request = (0, supertest_1.default)(server_1.default);
const storeProduct = new products_1.ProductStore();
const storeUser = new users_1.UserStore();
const storeOrder = new orders_1.OrderStore();
let indexProductResult;
let userId;
let orderId;
let productId;
let token;
describe('DashboardRoutes', () => {
    beforeAll(async () => {
        const user = {
            firstname: 'Brad',
            lastname: 'Pitt',
            password_digest: 'Fury',
        };
        const createUserResponse = await request
            .post('/users')
            .send(user)
            .set('Accept', 'application/json');
        token = createUserResponse.body;
        const indexUserResult = await storeUser.index();
        userId = `${indexUserResult[0].id}`;
        for (let i = 0; i < 7; i += 1) {
            const product = {
                name: `Product${i}`,
                price: i,
                category: `Category${i}`,
            };
            await storeProduct.create(product);
        }
        indexProductResult = await storeProduct.index();
        productId = indexProductResult[0].id;
        for (let i = 0; i < 7; i += 1) {
            const order = {
                status: enum_1.default.ACTIVE,
                user_id: userId,
            };
            const createOrderResult = await storeOrder.create(order);
            const orderProducts = {
                quantity: i,
                order_id: `${createOrderResult.id}`,
                product_id: `${indexProductResult[i].id}`,
            };
            await storeOrder.addProduct(orderProducts);
        }
        const indexOrderResult = await storeOrder.index();
        orderId = indexOrderResult[0].id;
    });
    afterAll(async () => {
        for (let i = 0; i < 7; i += 1) {
            await storeOrder.removeProduct(`${i + orderId}`, `${i + productId}`);
            await storeOrder.delete(`${i + orderId}`);
        }
        for (let i = productId; i < productId + 7; i += 1) {
            await storeProduct.delete(`${i}`);
        }
        await storeUser.delete(userId);
    });
    describe('GET /fiveMostWanted', () => {
        it('should return the top 5 most popular products', async () => {
            const fiveMostWantedResult = await request
                .get('/five_most-wanted')
                .set('Accept', 'application/json');
            expect(fiveMostWantedResult.status).toBe(200);
            expect(fiveMostWantedResult.body).toEqual([
                {
                    name: 'Product6',
                    category: 'Category6',
                    volume: '6',
                    orders_placed: '1',
                },
                {
                    name: 'Product5',
                    category: 'Category5',
                    volume: '5',
                    orders_placed: '1',
                },
                {
                    name: 'Product4',
                    category: 'Category4',
                    volume: '4',
                    orders_placed: '1',
                },
                {
                    name: 'Product3',
                    category: 'Category3',
                    volume: '3',
                    orders_placed: '1',
                },
                {
                    name: 'Product2',
                    category: 'Category2',
                    volume: '2',
                    orders_placed: '1',
                },
            ]);
        });
    });
    describe('GET /productByCategory', () => {
        it('should return all products of a category', async () => {
            const productByCategory = await request
                .get('/products_by_category/Category2')
                .set('Accept', 'application/json');
            expect(productByCategory.status).toBe(200);
            expect(productByCategory.body).toEqual([
                {
                    category: 'Category2',
                    name: 'Product2',
                },
            ]);
        });
    });
    describe('GET /completed_order_per_user/:userId', () => {
        it('should return all products of a category', async () => {
            const currentOrdersPerUser = await request
                .get(`/completed_order_per_user/${userId}`)
                .set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(currentOrdersPerUser.status).toBe(200);
            expect(currentOrdersPerUser.body).toEqual([
                { id: orderId, status: 'active' },
                { id: (orderId + 1), status: 'active' },
                { id: (orderId + 2), status: 'active' },
                { id: (orderId + 3), status: 'active' },
                { id: (orderId + 4), status: 'active' },
                { id: (orderId + 5), status: 'active' },
                { id: (orderId + 6), status: 'active' },
            ]);
        });
    });
});
