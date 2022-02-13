"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
const dashboard_1 = require("../../services/dashboard");
const products_1 = require("../../models/products");
const orders_1 = require("../../models/orders");
const enum_1 = __importDefault(require("../../utils/enum"));
const users_1 = require("../../models/users");
const store = new dashboard_1.DasboardQueries();
const storeProduct = new products_1.ProductStore();
const storeUser = new users_1.UserStore();
const storeOrder = new orders_1.OrderStore();
let indexProductResult;
let userId;
let orderId;
let productId;
describe('Dashboard queries', () => {
    beforeAll(async () => {
        const user = {
            firstname: 'Robert',
            lastname: 'De Niro',
            password_digest: 'MeetTheParents',
        };
        await storeUser.create(user);
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
    describe('fiveMostWanted query', () => {
        it('should have a fiveMostWanted method', () => {
            expect(store.fiveMostWanted).toBeDefined();
        });
        it('should return the top 5 most popular products ', async () => {
            const fiveMostWantedResult = await store.fiveMostWanted();
            expect(fiveMostWantedResult).toEqual([
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
    describe('productByCategory query', () => {
        it('should have a productByCategory method', () => {
            expect(store.productByCategory).toBeDefined();
        });
        it('should return all products of a category', async () => {
            const productByCategory = await store.productByCategory('Category1');
            expect(productByCategory).toEqual([
                {
                    category: 'Category1',
                    name: 'Product1',
                },
            ]);
        });
    });
    describe('currentOrdersPerUser query', () => {
        it('should have a currentOrdersPerUser method', () => {
            expect(store.currentOrdersPerUser).toBeDefined();
        });
        it('should return all orders of a user', async () => {
            const currentOrdersPerUser = await store.currentOrdersPerUser(userId);
            expect(currentOrdersPerUser).toEqual([
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
