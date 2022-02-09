"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../../models/orders");
const products_1 = require("../../models/products");
const users_1 = require("../../models/users");
const enum_1 = __importDefault(require("../../utils/enum"));
const storeUser = new users_1.UserStore();
const storeProduct = new products_1.ProductStore();
const store = new orders_1.OrderStore();
describe('Order Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('should have a addProduct method', () => {
        expect(store.addProduct).toBeDefined();
    });
    it('should have a addProduct method', () => {
        expect(store.editProduct).toBeDefined();
    });
    it('should have a addProduct method', () => {
        expect(store.removeProduct).toBeDefined();
    });
    let user;
    let resultUser;
    let product;
    let resultProduct;
    let createResult;
    let order;
    beforeAll(async () => {
        user = {
            firstname: 'Igor',
            lastname: 'FromTheJungle',
            password_digest: 'password',
        };
        resultUser = await storeUser.create(user);
        product = {
            name: 'Harry Potter',
            price: 40,
            category: 'book',
        };
        resultProduct = await storeProduct.create(product);
        order = {
            status: enum_1.default.ACTIVE,
            user_id: `${resultUser.id}`,
        };
    });
    afterAll(async () => {
        await storeUser.delete(`${resultUser.id}`);
        await storeProduct.delete(`${resultProduct.id}`);
    });
    it('create method should add an order', async () => {
        createResult = await store.create(order);
        expect(createResult).toEqual({
            id: createResult.id,
            status: `${order.status}`,
            user_id: `${order.user_id}`,
        });
    });
    it('index method should return a list ', async () => {
        const indexResult = await store.index();
        expect(indexResult).toEqual([
            {
                id: createResult.id,
                status: `${order.status}`,
                user_id: `${order.user_id}`,
            },
        ]);
    });
    it('show method should return the correct order', async () => {
        const showResult = await store.show('1');
        expect(showResult).toEqual({
            id: createResult.id,
            status: `${order.status}`,
            user_id: `${order.user_id}`,
        });
    });
    describe('order_products table', () => {
        let addProductResult;
        let orderProducts;
        let newOrderProducts;
        beforeAll(() => {
            orderProducts = {
                quantity: 5,
                order_id: `${createResult.id}`,
                product_id: `${resultProduct.id}`,
            };
            newOrderProducts = {
                quantity: 3,
                order_id: `${createResult.id}`,
                product_id: `${resultProduct.id}`,
            };
        });
        it('addProduct method should add a product and a quantity to the actual order', async () => {
            addProductResult = await store.addProduct(orderProducts);
            expect(addProductResult).toEqual({
                id: addProductResult.id,
                quantity: orderProducts.quantity,
                order_id: `${orderProducts.order_id}`,
                product_id: `${orderProducts.product_id}`,
            });
        });
        it('editProduct method should edit all products and quantities of the actual order', async () => {
            const editProductResult = await store.editProduct(orderProducts);
            expect(editProductResult).toEqual([
                {
                    id: addProductResult.id,
                    quantity: orderProducts.quantity,
                    order_id: `${orderProducts.order_id}`,
                    product_id: `${orderProducts.product_id}`,
                },
            ]);
        });
        it('updateProduct method should update the quantity of a product in the actual order', async () => {
            await store.updateProduct(newOrderProducts);
            const editProductResult = await store.editProduct(orderProducts);
            expect(editProductResult).toEqual([
                {
                    id: addProductResult.id,
                    quantity: newOrderProducts.quantity,
                    order_id: `${orderProducts.order_id}`,
                    product_id: `${orderProducts.product_id}`,
                },
            ]);
        });
        it('removeProduct method should remove the product from the actual order', async () => {
            await store.removeProduct(orderProducts);
            const editProductResult = await store.editProduct(orderProducts);
            expect(editProductResult).toEqual([]);
        });
    });
    it('delete method should remove the order', async () => {
        await store.delete(`${createResult.id}`);
        const indexResult = await store.index();
        expect(indexResult).toEqual([]);
    });
});