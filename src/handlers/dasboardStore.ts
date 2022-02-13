import express, { Request, Response } from 'express';
import { DasboardQueries } from '../services/dashboard';
import { verifyAuthToken } from './usersStore';

const dashboard = new DasboardQueries();

const fiveMostWanted = async (_req: Request, res: Response) => {
  const result = await dashboard.fiveMostWanted();
  res.json(result);
};

const productByCategory = async (req: Request, res: Response) => {
  const result = await dashboard.productByCategory(req.params.category);
  res.json(result);
};

const currentOrdersPerUser = async (req: Request, res: Response) => {
  const result = await dashboard.currentOrdersPerUser(req.params.userId);
  res.json(result);
};

const dashboardRoutes = (app: express.Application) => {
  app.get('/five_most-wanted', fiveMostWanted);
  app.get('/products_by_category/:category', productByCategory);
  app.get(
    '/completed_order_per_user/:userId',
    verifyAuthToken,
    currentOrdersPerUser
  );
};

export default dashboardRoutes;
