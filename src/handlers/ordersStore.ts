import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
// import {verifyAuthToken } from './usersStore';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  const result = await store.index();
  res.json(result);
};

const show = async (req: Request, res: Response) => {
  console.log(req.params);
  const result = await store.show(req.params.id);
  res.json(result);
};

const create = async (req: Request, res: Response) => {
  console.log(req.body);
  const order: Order = {
    status: req.body.status,
  };
  const result = await store.create(order);
  res.json(result);
};

const destroy = async (req: Request, res: Response) => {
  console.log(req.params);
  const result = await store.delete(req.params.id);
  res.json(result);
};

const addProduct = async (req: Request, res: Response) => {
  const orderId: string = req.params.id;
  const productId: string = req.params.product_id;
  const quantity: number = parseInt(req.params.quantity, 10);
  try {
    const addedProduct = await store.addProduct(quantity, productId, orderId);
    res.json(addedProduct);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const ordersRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.delete('/orders/:id', destroy);
  // add product to an order
  app.post('/orders/:id/products', addProduct);
};

export default ordersRoutes;
