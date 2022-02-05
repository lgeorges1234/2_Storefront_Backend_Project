import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
// import {verifyAuthToken } from './usersStore';

const store = new ProductStore();

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
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  };
  const result = await store.create(product);
  res.json(result);
};

const destroy = async (req: Request, res: Response) => {
  console.log(req.params);
  const result = await store.delete(req.params.id);
  res.json(result);
};

const productsRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', create);
  app.delete('/products/:id', destroy);
};

export default productsRoutes;
