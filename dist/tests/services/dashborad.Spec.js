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
const store = new dashboard_1.DasboardQueris();
const storeProduct = new products_1.ProductStore();
const storeUser = new users_1.UserStore();
const storeOrder = new orders_1.OrderStore();
let userId;
let orderId;
let productId;
describe('Dashboard queries', () => {
    describe('fiveMostWanted query', () => {
        it('should have a fiveMostWanted method', () => {
            expect(store.fiveMostWanted).toBeDefined();
        });
        beforeAll(async () => {
            const user = {
                firstname: 'Robert',
                lastname: 'Redford',
                password_digest: 'LionsAndLambs',
            };
            await storeUser.create(user);
            const indexUserResult = await storeUser.index();
            userId = `${indexUserResult[0].id}`;
            console.log(`index User : `);
            console.log(indexUserResult);
            for (let i = 0; i < 7; i += 1) {
                const product = {
                    name: `Product${i}`,
                    price: i,
                    category: `Category${i}`,
                };
                await storeProduct.create(product);
            }
            const indexProductResult = await storeProduct.index();
            productId = `${indexProductResult[0].id}`;
            console.log(`index Product :`);
            console.log(indexProductResult);
            for (let i = 0; i < 7; i += 1) {
                const order = {
                    status: enum_1.default.ACTIVE,
                    user_id: userId,
                };
                const createOrderResult = await storeOrder.create(order);
                const orderProducts = {
                    quantity: i,
                    order_id: `${createOrderResult.id}`,
                    product_id: `${JSON.stringify(indexProductResult[i].id)}`,
                };
                await storeOrder.addProduct(orderProducts);
            }
            const indexOrderResult = await storeOrder.index();
            orderId = `${indexOrderResult[0].id}`;
            console.log(`index Order :`);
            console.log(indexOrderResult);
            const indexaddProductResult = storeOrder.indexProduct();
            console.log(`index Products by order`);
            console.log(indexaddProductResult);
        });
        afterAll(async () => {
            console.log(`orderId : ${orderId}`);
            for (let i = parseInt(orderId, 10); i < parseInt(orderId, 10) + 7; i += 1) {
                await storeOrder.removeProduct(`${i}`, `${i + 1}`);
                const indexaddProductResult = storeOrder.indexProduct();
                console.log(`index Products by order`);
                console.log(JSON.stringify(indexaddProductResult));
                await storeOrder.delete(`${i}`);
                const indexOrderResult = await storeOrder.index();
                console.log(`index Order :`);
                console.log(indexOrderResult);
            }
            const indexaddProductResult = storeOrder.indexProduct();
            console.log(`index Products by order`);
            console.log(indexaddProductResult);
            const indexOrderResult = await storeOrder.index();
            console.log(`index Order :`);
            console.log(indexOrderResult);
            console.log(`productId : ${productId}`);
            for (let i = parseInt(productId, 10); i < parseInt(productId, 10) + 7; i += 1) {
                await storeProduct.delete(`${i}`);
            }
            const indexProductResult = await storeProduct.index();
            console.log(`index Product :`);
            console.log(indexProductResult);
            await storeUser.delete(userId);
            const indexUserResult = await storeUser.index();
            console.log(`Index User : `);
            console.log(indexUserResult);
        });
        it('should return the top 5 most popular products ', async () => {
            const fiveMostWantedResult = await store.fiveMostWanted();
            console.log(`fiveMostWantedResult : `);
            console.log(fiveMostWantedResult);
        });
    });
});
