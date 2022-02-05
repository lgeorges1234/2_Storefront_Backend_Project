import express, { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User, UserStore } from '../models/users';

const store = new UserStore();

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
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_digest: req.body.password,
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as Secret
    );
    res.json(token);
  } catch (error) {
    res.status(400);
    res.json(`${error}${user}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  console.log(req.params);
  const result = await store.delete(req.params.id);
  res.json(result);
};

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_digest: req.body.password,
  };
  try {
    const authenticateUser = await store.authenticate(user.lastname as string);
    const token = jwt.sign(
      { user: authenticateUser },
      process.env.TOKEN_SECRET as Secret
    );
    res.json(token);
  } catch (error) {
    res.status(401);
    res.json({ error });
  }
};

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as Secret);
    next();
  } catch (error) {
    res.status(401);
  }
};

const usersRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', show);
  app.post('/users', create);
  app.delete('/users/:id', destroy);
  app.post('/users/authenticate', authenticate);
};

export default usersRoutes;
