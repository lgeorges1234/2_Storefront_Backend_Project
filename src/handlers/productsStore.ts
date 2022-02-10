import express, { Request, Response, NextFunction } from 'express';
import { Product, ProductStore } from '../models/products';
import { verifyAuthToken } from './usersStore';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const result = await store.index();
    res.json(result);
  } catch (error) {
    res.status(401).json(`${error}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const result = await store.show(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(401).json(`${error}`);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
  };
  try {
    const result = await store.create(product);
    res.json(result);
  } catch (error) {
    res.status(400).json(`${error}${product}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const result = await store.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await store.index();
    const existingId = results.filter(
      (result) =>
        (result.id as unknown as number) ===
        parseInt(req.params.id as unknown as string, 10)
    );
    if (existingId.length) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

const verifyProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.name && req.body.price && req.body.category) {
      next();
    } else {
      throw new Error('Product settings');
    }
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

const productsRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', verifyId, show);
  app.post('/products', verifyAuthToken, verifyProduct, create);
  app.delete('/products/:id', verifyAuthToken, verifyId, destroy);
};

export default productsRoutes;
