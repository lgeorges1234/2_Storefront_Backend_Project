/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import { Product } from '../../models/products';
import app from '../../server';

const request = supertest(app);

let product: Product;
let noProduct: Object;

let createResponse: supertest.Response;

describe('productsRoutes', () => {
  beforeAll(() => {
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
  });
  describe('CREATE POST /products', () => {
    it('correct product settings should return a new created product', async () => {
      createResponse = await request
        .post('/products')
        .send(product)
        .set('Accept', 'application/json');
      // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })

      expect(createResponse.status).toBe(200);
      expect(createResponse.body).toEqual({
        id: createResponse.body.id,
        name: product.name,
        price: product.price,
        category: product.category,
      });
    });
    it('wrong product settings should return an error', async () => {
      const createErrorResponse = await request
        .post('/products')
        .send(noProduct)
        .set('Accept', 'application/json');
      // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })
      expect(createErrorResponse.status).toBe(401);
      expect(createErrorResponse.error).toBeTruthy;
    });
  });

  describe('EDIT GET /products', () => {
    it('should return all created products', async () => {
      const indexResponse = await request
        .get('/products')
        .set('Accept', 'application/json');
      // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })
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
      const showResponse = await request.get(`/products/56`);
      expect(showResponse.status).toBe(401);
      expect(showResponse.error).toBeTruthy;
    });
    it('correct product id number should return the product', async () => {
      const showResponse = await request.get(
        `/products/${createResponse.body.id}`
      );
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
      const deleteResponse = await request.delete(`/products/56`);
      expect(deleteResponse.status).toBe(401);
      expect(deleteResponse.error).toBeTruthy;
    });
    it('correct product id number should delete the product', async () => {
      const deleteResponse = await request.delete(
        `/products/${createResponse.body.id}`
      );
      const indexResponse = await request
        .get('/products')
        .set('Accept', 'application/json');
      // .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M')
      // .auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2F0ZXIgQm90dGxlIiwicHJpY2UiOiIyLjk5In0.Flq3cKKZoTs8hWcAaTqJbvcAaJpb3FVi2IXU7rCzvvU', { type: 'bearer' })

      expect(deleteResponse.status).toBe(200);
      expect(indexResponse.body).toEqual([]);
    });
  });
});
