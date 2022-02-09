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
let user;
let noUser;
let createResponse;
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
    });
    describe('CREATE POST /users', () => {
        it('correct user settings should return a new created user', async () => {
            createResponse = await request
                .post('/users')
                .send(user)
                .set('Accept', 'application/json');
            // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
            // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })
            expect(createResponse.status).toBe(200);
            expect(createResponse.body).toEqual({
                id: createResponse.body.id,
                firstname: user.firstname,
                lastname: user.lastname,
                password_digest: user.password_digest,
            });
        });
        it('wrong user settings should return an error', async () => {
            const createErrorResponse = await request
                .post('/users')
                .send(noUser)
                .set('Accept', 'application/json');
            // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
            // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })
            expect(createErrorResponse.status).toBe(401);
            expect(createErrorResponse.error).toBeTruthy;
        });
    });
    describe('EDIT GET /users', () => {
        it('should return all created users', async () => {
            const indexResponse = await request
                .get('/users')
                .set('Accept', 'application/json');
            // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
            // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })
            console.log(indexResponse.body);
            expect(indexResponse.status).toBe(200);
            expect(indexResponse.body).toEqual([
                {
                    id: createResponse.body.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    password_digest: user.password_digest,
                },
            ]);
        });
    });
    describe('SHOW GET /users/{id}', () => {
        it('wrong user id number should return an error', async () => {
            const showResponse = await request.get(`/users/56`);
            expect(showResponse.status).toBe(401);
            expect(showResponse.error).toBeTruthy;
        });
        it('correct user id number should return the user', async () => {
            const showResponse = await request.get(`/users/${createResponse.body.id}`);
            expect(showResponse.status).toBe(200);
            expect(showResponse.body).toEqual({
                id: createResponse.body.id,
                firstname: user.firstname,
                lastname: user.lastname,
                password_digest: user.password_digest,
            });
        });
    });
    describe('Delete DELETE /users/{id}', () => {
        it('wrong user id number should return an error', async () => {
            const deleteResponse = await request.delete(`/users/56`);
            expect(deleteResponse.status).toBe(401);
            expect(deleteResponse.error).toBeTruthy;
        });
        it('correct user id number should delete the user', async () => {
            const deleteResponse = await request.delete(`/users/${createResponse.body.id}`);
            const indexResponse = await request
                .get('/users')
                .set('Accept', 'application/json');
            // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
            // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })
            expect(deleteResponse.status).toBe(200);
            expect(indexResponse.body).toEqual([]);
        });
    });
});
