"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../../models/products");
const store = new products_1.ProductStore();
describe('Product Model', () => {
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
    let product;
    let createResult;
    beforeAll(() => {
        product = {
            name: 'Twingo',
            price: 12000,
            category: 'car',
        };
    });
    it('create method should add a product', async () => {
        createResult = await store.create(product);
        expect(createResult).toEqual({
            id: createResult.id,
            name: `${product.name}`,
            price: product.price,
            category: `${product.category}`,
        });
    });
    it('index method should return a list ', async () => {
        const indexResult = await store.index();
        expect(indexResult).toEqual([
            {
                id: createResult.id,
                name: `${product.name}`,
                price: product.price,
                category: `${product.category}`,
            },
        ]);
    });
    it('show method should return the correct product', async () => {
        const showResult = await store.show(`${createResult.id}`);
        expect(showResult).toEqual({
            id: createResult.id,
            name: `${product.name}`,
            price: product.price,
            category: `${product.category}`,
        });
    });
    it('delete method should remove the product', async () => {
        await store.delete(`${createResult.id}`);
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
