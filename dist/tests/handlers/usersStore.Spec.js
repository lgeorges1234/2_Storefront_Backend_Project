"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = __importDefault(require("../../server"));
const request = (0, supertest_1.default)(server_1.default);
const pepper = process.env.BCRYPT_PASSWORD;
let user;
let noUser;
let badPasswordUser;
let falseUser;
let indexResponse;
let token;
describe('usersRoutes', () => {
    beforeAll(() => {
        user = {
            firstname: 'Jean-Claude',
            lastname: 'Van Damme',
            password_digest: 'kickboxer',
        };
        noUser = {
            name: 'Jean-Claude',
            lastname: 'Van Damme',
            password_digest: 'kickboxer',
        };
        badPasswordUser = {
            firstname: 'Jean-Claude',
            lastname: 'Van Damme',
            password_digest: 'false_password',
        };
        falseUser = {
            firstname: 'Jean-Claude',
            lastname: 'Smith',
            password_digest: 'kickboxer',
        };
    });
    describe('CREATE POST /users', () => {
        it('correct user settings should return a token', async () => {
            const createResponse = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            token = createResponse.body;
            expect(createResponse.status).toBe(200);
            expect(createResponse.body).toBeTruthy;
        });
        it('wrong user settings should return an error', async () => {
            const createErrorResponse = await request
                .post('/users')
                .send(noUser)
                .set('Accept', 'application/json');
            expect(createErrorResponse.status).toBe(401);
            expect(createErrorResponse.error).toBeTruthy;
        });
    });
    describe('EDIT GET /users', () => {
        it('should return all created users', async () => {
            indexResponse = await request.get('/users').set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(indexResponse.status).toBe(200);
            expect(indexResponse.body.length).toEqual(1);
        });
    });
    describe('SHOW GET /users/{id}', () => {
        it('wrong user id number should return an error', async () => {
            const showResponse = await request.get(`/users/56`).set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(showResponse.status).toBe(401);
            expect(showResponse.error).toBeTruthy;
        });
        it('correct user id number should return the user', async () => {
            const showResponse = await request
                .get(`/users/${indexResponse.body[0].id}`)
                .set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(showResponse.status).toBe(200);
            expect(showResponse.body.id).toEqual(indexResponse.body[0].id);
            expect(showResponse.body.firstname).toEqual(user.firstname);
            expect(showResponse.body.lastname).toEqual(user.lastname);
            expect(bcrypt_1.default.compareSync(user.password_digest + pepper, showResponse.body.password_digest)).toBeTruthy;
        });
    });
    describe('AUTHENTICATE POST /users/authenticate', () => {
        it('known user should return a valid jwt token', async () => {
            const authenticateResponse = await request
                .post('/users/authenticate')
                .send(user)
                .set('Accept', 'application/json');
            const authenticateToken = authenticateResponse.body;
            const showResponse = await request
                .get(`/users/${indexResponse.body[0].id}`)
                .set({
                Authorization: `bearer ${authenticateToken}`,
                'Content-Type': 'application/json',
            });
            expect(authenticateResponse.status).toBe(200);
            expect(authenticateResponse.body).toBeTruthy;
            expect(showResponse.status).toBe(200);
        });
        it('known user with wrong password should return an error', async () => {
            const authenticateResponse = await request
                .post('/users/authenticate')
                .send(badPasswordUser)
                .set('Accept', 'application/json');
            expect(authenticateResponse.status).toBe(401);
            expect(authenticateResponse.error).toBeTruthy;
        });
        it('unknown user should return an error', async () => {
            const authenticateResponse = await request
                .post('/users/authenticate')
                .send(falseUser)
                .set('Accept', 'application/json');
            expect(authenticateResponse.status).toBe(401);
            expect(authenticateResponse.error).toBeTruthy;
        });
    });
    describe('Delete DELETE /users/{id}', () => {
        it('wrong user id number should return an error', async () => {
            const deleteResponse = await request.delete(`/users/56`).set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(deleteResponse.status).toBe(401);
            expect(deleteResponse.error).toBeTruthy;
        });
        it('correct user id number should delete the user', async () => {
            const deleteResponse = await request
                .delete(`/users/${indexResponse.body[0].id}`)
                .set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            const indexDeleteResponse = await request.get('/users').set({
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            });
            expect(deleteResponse.status).toBe(200);
            expect(indexDeleteResponse.body).toEqual([]);
        });
    });
});
