/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import { Order, OrderProducts } from '../../models/orders';
import { Product } from '../../models/products';
import { User } from '../../models/users';
import app from '../../server';
import OrderStates from '../../utils/enum';

const request = supertest(app);

let order: Order;
let noOrder: Object;
let token: String;
let orderProduct: OrderProducts;
let newOrderProduct: OrderProducts;

let createResponse: supertest.Response;
let indexUserResponse: supertest.Response;
let createProductResponse: supertest.Response;
let addProductResponse: supertest.Response;

describe('ordersRoutes', () => {
  beforeAll(async () => {
    const user: User = {
      firstname: 'Jean-Claude',
      lastname: 'Van Damme',
      password_digest: 'kickboxer',
    };
    const createUserResponse = await request
      .post('/users')
      .send(user)
      .set('Accept', 'application/json');
    token = createUserResponse.body;
    indexUserResponse = await request.get('/users').set({
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    });
    order = {
      status: `${OrderStates.ACTIVE}`,
      user_id: indexUserResponse.body[0].id,
    };
    noOrder = {
      name: `${OrderStates.ACTIVE}`,
      user_id: indexUserResponse.body[0].id,
    };
  });
  afterAll(async () => {
    await request.delete(`/users/${indexUserResponse.body[0].id}`).set({
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    });
  });
  describe('CREATE POST /orders', () => {
    it('wrong order settings should return an error', async () => {
      const createErrorResponse = await request
        .post('/orders')
        .send(noOrder)
        .set({
          'Content-Type': 'application/json',
        });
      expect(createErrorResponse.status).toBe(400);
      expect(createErrorResponse.error).toBeTruthy;
    });
    it('correct order settings should return a new created order', async () => {
      createResponse = await request.post('/orders').send(order).set({
        'Content-Type': 'application/json',
      });
      expect(createResponse.status).toBe(200);
      expect(createResponse.body).toEqual({
        id: createResponse.body.id,
        status: `${order.status}`,
        user_id: `${order.user_id}`,
      });
    });
  });

  describe('EDIT GET /orders', () => {
    it('should return all created orders', async () => {
      const indexResponse = await request
        .get('/orders')
        .set('Accept', 'application/json');
      expect(indexResponse.status).toBe(200);
      expect(indexResponse.body).toEqual([
        {
          id: createResponse.body.id,
          status: `${order.status}`,
          user_id: `${order.user_id}`,
        },
      ]);
    });
  });

  describe('SHOW GET /orders/{id}', () => {
    it('wrong order id number should return an error', async () => {
      const showErrorResponse = await request.get(`/orders/56`);
      expect(showErrorResponse.status).toBe(401);
      expect(showErrorResponse.error).toBeTruthy;
    });
    it('correct order id number should return the order', async () => {
      const showResponse = await request.get(
        `/orders/${createResponse.body.id}`
      );
      expect(showResponse.status).toBe(200);
      expect(showResponse.body).toEqual({
        id: createResponse.body.id,
        status: `${order.status}`,
        user_id: `${order.user_id}`,
      });
    });
  });

  describe('order_products', () => {
    beforeAll(async () => {
      const product: Product = {
        name: 'Chevrolet',
        price: 25000,
        category: 'car',
      };
      createProductResponse = await request
        .post(`/products/`)
        .send(product)
        .set({
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        });
      const productId = createProductResponse.body.id;
      orderProduct = {
        quantity: 50,
        order_id: `${createResponse.body.id}`,
        product_id: `${productId}`,
      };
      newOrderProduct = {
        quantity: 500,
        order_id: `${createResponse.body.id}`,
        product_id: `${productId}`,
      };
    });
    afterAll(async () => {
      await request.delete(`/products/${orderProduct.product_id}`).set({
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      });
    });
    it(`CREATE POST /orders/:id/products`, async () => {
      addProductResponse = await request
        .post(`/orders/${orderProduct.order_id}/products`)
        .send(orderProduct)
        .set({
          'Content-Type': 'application/json',
        });
      expect(addProductResponse.status).toBe(200);
      expect(addProductResponse.body).toEqual({
        id: addProductResponse.body.id,
        quantity: orderProduct.quantity,
        order_id: `${orderProduct.order_id}`,
        product_id: `${orderProduct.product_id}`,
      });
    });
    it(`EDIT GET /orders/:id/products`, async () => {
      const editProductResponse = await request
        .get(`/orders/${orderProduct.order_id}/products`)
        .set({
          'Content-Type': 'application/json',
        });
      expect(editProductResponse.status).toBe(200);
      expect(editProductResponse.body).toEqual([
        {
          id: addProductResponse.body.id,
          quantity: orderProduct.quantity,
          order_id: `${orderProduct.order_id}`,
          product_id: `${orderProduct.product_id}`,
        },
      ]);
    });
    it(`UPDATE PUT /orders/:id/products/:products_id`, async () => {
      const updateProductResponse = await request
        .patch(
          `/orders/${orderProduct.order_id}/products/${orderProduct.product_id}`
        )
        .send(newOrderProduct)
        .set({
          'Content-Type': 'application/json',
        });
      expect(updateProductResponse.status).toBe(200);
      expect(updateProductResponse.body).toEqual({
        id: addProductResponse.body.id,
        quantity: newOrderProduct.quantity,
        order_id: `${orderProduct.order_id}`,
        product_id: `${orderProduct.product_id}`,
      });
    });
    it(`DELETE DELETE /orders/:id/products/:products_id`, async () => {
      const removeProductResponse = await request
        .delete(
          `/orders/${orderProduct.order_id}/products/${orderProduct.product_id}`
        )
        .set({
          'Content-Type': 'application/json',
        });
      expect(removeProductResponse.status).toBe(200);
      expect(removeProductResponse.body).toEqual({
        id: addProductResponse.body.id,
        quantity: newOrderProduct.quantity,
        order_id: `${orderProduct.order_id}`,
        product_id: `${orderProduct.product_id}`,
      });
    });
  });

  describe('Delete DELETE /orders/{id}', () => {
    it('wrong order id number should return an error', async () => {
      const deleteErrorResponse = await request.delete(`/orders/56`);
      expect(deleteErrorResponse.status).toBe(401);
      expect(deleteErrorResponse.error).toBeTruthy;
    });
    it('correct order id number should delete the order', async () => {
      const deleteResponse = await request.delete(
        `/orders/${createResponse.body.id}`
      );
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({
        id: createResponse.body.id,
        status: `${order.status}`,
        user_id: `${order.user_id}`,
      });
    });
  });
});
