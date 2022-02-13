/* eslint-disable no-await-in-loop */
import { DasboardQueries } from '../../services/dashboard';
import { Product, ProductStore } from '../../models/products';
import { Order, OrderProducts, OrderStore } from '../../models/orders';
import OrderStates from '../../utils/enum';
import { UserStore } from '../../models/users';

const store = new DasboardQueries();
const storeProduct = new ProductStore();
const storeUser = new UserStore();
const storeOrder = new OrderStore();

let indexProductResult: Product[];

let userId: string;
let orderId: number;
let productId: number;

describe('Dashboard queries', () => {
  beforeAll(async () => {
    const user = {
      firstname: 'Robert',
      lastname: 'De Niro',
      password_digest: 'MeetTheParents',
    };
    await storeUser.create(user);
    const indexUserResult = await storeUser.index();
    userId = `${indexUserResult[0].id}`;
    for (let i = 0; i < 7; i += 1) {
      const product: Product = {
        name: `Product${i}`,
        price: i,
        category: `Category${i}`,
      };
      await storeProduct.create(product);
    }
    indexProductResult = await storeProduct.index();
    productId = indexProductResult[0].id as unknown as number;
  });
  afterAll(async () => {
    for (let i = productId; i < productId + 7; i += 1) {
      await storeProduct.delete(`${i}`);
    }

    await storeUser.delete(userId);
  });
  describe('fiveMostWanted query', () => {
    beforeAll(async () => {
      for (let i = 0; i < 7; i += 1) {
        const order: Order = {
          status: OrderStates.ACTIVE,
          user_id: userId,
        };
        const createOrderResult = await storeOrder.create(order);
        const orderProducts: OrderProducts = {
          quantity: i,
          order_id: `${createOrderResult.id}`,
          product_id: `${indexProductResult[i].id}`,
        };
        await storeOrder.addProduct(orderProducts);
      }
      const indexOrderResult = await storeOrder.index();
      orderId = indexOrderResult[0].id as unknown as number;
    });
    afterAll(async () => {
      for (let i = 0; i < 7; i += 1) {
        await storeOrder.removeProduct(`${i + orderId}`, `${i + productId}`);
        await storeOrder.delete(`${i + orderId}`);
      }
    });
    it('should have a fiveMostWanted method', () => {
      expect(store.fiveMostWanted).toBeDefined();
    });
    it('should return the top 5 most popular products ', async () => {
      const fiveMostWantedResult = await store.fiveMostWanted();
      expect(fiveMostWantedResult).toEqual([
        {
          name: 'Product6',
          category: 'Category6',
          volume: '6',
          orders_placed: '1',
        },
        {
          name: 'Product5',
          category: 'Category5',
          volume: '5',
          orders_placed: '1',
        },
        {
          name: 'Product4',
          category: 'Category4',
          volume: '4',
          orders_placed: '1',
        },
        {
          name: 'Product3',
          category: 'Category3',
          volume: '3',
          orders_placed: '1',
        },
        {
          name: 'Product2',
          category: 'Category2',
          volume: '2',
          orders_placed: '1',
        },
      ]);
    });
  });
  describe('productByCategory query', () => {
    it('should have a productByCategory method', () => {
      expect(store.productByCategory).toBeDefined();
    });
    it('should return all products of a category', async () => {
      const productByCategory = await store.productByCategory('Category1');
      expect(productByCategory).toEqual([
        {
          category: 'Category1',
          name: 'Product1',
        },
      ]);
    });
  });
});
