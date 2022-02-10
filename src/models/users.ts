/* eslint-disable class-methods-use-this */
import bcrypt from 'bcrypt';
import client from '../database';

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD as string;

export type User = {
  id?: Number;
  firstname: String;
  lastname: String;
  password_digest: String;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const sql = 'SELECT * FROM users';
      const conn = await client.connect();
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get users. Error: ${error}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not get user ${id}. Error: ${error}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const hash = bcrypt.hashSync(
        user.password_digest + pepper,
        parseInt(saltRounds as string, 10)
      );

      const result = await conn.query(sql, [
        user.firstname,
        user.lastname,
        hash,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add new user. Error: ${error}`);
    }
  }

  async authenticate(user: User): Promise<User> {
    const sql = 'SELECT * FROM users WHERE lastname=($1)';
    const conn = await client.connect();
    const result = await conn.query(sql, [user.lastname]);
    conn.release();
    if (result.rows.length) {
      if (
        bcrypt.compareSync(
          user.password_digest + pepper,
          result.rows[0].password_digest
        )
      ) {
        return result.rows[0];
      }
      throw new Error(`Authentication of  ${user.lastname} has not succeed.`);
    }
    throw new Error(`User ${user.lastname} does not exist.`);
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete user ${id}. Error: ${error}`);
    }
  }
}
