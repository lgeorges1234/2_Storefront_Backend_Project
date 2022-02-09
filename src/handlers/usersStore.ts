import express, { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User, UserStore } from '../models/users';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const result = await store.index();
  res.json(result);
};

const show = async (req: Request, res: Response) => {
  const result = await store.show(req.params.id);
  res.json(result);
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_digest: req.body.password_digest,
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
  const result = await store.delete(req.params.id);
  res.json(result);
};

const authenticate = async (req: Request, res: Response) => {
  const user: User = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password_digest: req.body.password_digest,
  };
  try {
    const authenticateUser = await store.authenticate(user);
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

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.firstname && req.body.lastname && req.body.password_digest) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401);
    res.json({ error });
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
    res.json({ error });
  }
};

const usersRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, verifyId, show);
  app.post('/users', verifyUser, create);
  app.delete('/users/:id', verifyAuthToken, verifyId, destroy);
  app.post('/users/authenticate', verifyUser, authenticate);
};

export default usersRoutes;
