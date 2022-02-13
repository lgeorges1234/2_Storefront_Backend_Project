"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-expressions */
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../../models/users");
const pepper = process.env.BCRYPT_PASSWORD;
const store = new users_1.UserStore();
describe('User Model', () => {
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
    let user;
    let createResult;
    beforeAll(() => {
        user = {
            firstname: 'Georges',
            lastname: 'Clooney',
            password_digest: 'OBrother',
        };
    });
    it('create method should add a user', async () => {
        createResult = await store.create(user);
        expect(createResult.id).toEqual(createResult.id);
        expect(createResult.firstname).toEqual(`${user.firstname}`);
        expect(createResult.lastname).toEqual(`${user.lastname}`);
        expect(bcrypt_1.default.compareSync(user.password_digest + pepper, createResult.password_digest)).toBeTruthy;
    });
    it('index method should return a list ', async () => {
        const indexResult = await store.index();
        expect(indexResult.length).toEqual(1);
    });
    it('show method should return the correct user', async () => {
        const showResult = await store.show(`${createResult.id}`);
        expect(showResult.id).toEqual(createResult.id);
        expect(showResult.firstname).toEqual(`${user.firstname}`);
        expect(showResult.lastname).toEqual(`${user.lastname}`);
        expect(bcrypt_1.default.compareSync(user.password_digest + pepper, showResult.password_digest)).toBeTruthy;
    });
    it('authenticate method should return an authenticated user', async () => {
        const authenticateResult = await store.authenticate(user);
        expect(authenticateResult.id).toEqual(createResult.id);
        expect(authenticateResult.firstname).toEqual(`${user.firstname}`);
        expect(authenticateResult.lastname).toEqual(`${user.lastname}`);
        expect(bcrypt_1.default.compareSync(user.password_digest + pepper, authenticateResult.password_digest)).toBeTruthy;
    });
    it('delete method should remove the user', async () => {
        await store.delete(`${createResult.id}`);
        const indexResult = await store.index();
        expect(indexResult).toEqual([]);
    });
});
