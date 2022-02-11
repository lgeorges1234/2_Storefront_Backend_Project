/* eslint-disable no-await-in-loop */
import { DasboardQueris } from '../../services/dashboard';
import { Product, ProductStore } from '../../models/products';
import { Order, OrderProducts, OrderStore } from '../../models/orders';
import OrderStates from '../../utils/enum';
import { UserStore } from '../../models/users';

const store = new DasboardQueris();
const storeProduct = new ProductStore();
const storeUser = new UserStore();
const storeOrder = new OrderStore();

let userId: string;
let orderId: string;
let productId: string;

describe('Dashboard queries', () => {
  describe('fiveMostWanted query', () => {
    it('should have a fiveMostWanted method', () => {
      expect(store.fiveMostWanted).toBeDefined();
    });
    beforeAll(async () => {
      const user = {
        firstname: 'Robert',
        lastname: 'Redford',
        password_digest: 'LionsAndLambs',
      };
      await storeUser.create(user);
      const indexUserResult = await storeUser.index();
      userId = `${indexUserResult[0].id}`;
      console.log(`index User : `);
      console.log(indexUserResult);
      for (let i = 0; i < 7; i += 1) {
        const product: Product = {
          name: `Product${i}`,
          price: i,
          category: `Category${i}`,
        };
        await storeProduct.create(product);
      }
      const indexProductResult = await storeProduct.index();
      productId = `${indexProductResult[0].id}`;
      console.log(`index Product :`);
      console.log(indexProductResult);
      for (let i = 0; i < 7; i += 1) {
        const order: Order = {
          status: OrderStates.ACTIVE,
          user_id: userId,
        };
        const createOrderResult = await storeOrder.create(order);
        const orderProducts: OrderProducts = {
          quantity: i,
          order_id: `${createOrderResult.id}`,
          product_id: `${JSON.stringify(indexProductResult[i].id)}`,
        };
        await storeOrder.addProduct(orderProducts);
      }
      const indexOrderResult = await storeOrder.index();
      orderId = `${indexOrderResult[0].id}`;
      console.log(`index Order :`);
      console.log(indexOrderResult);
      const indexaddProductResult = storeOrder.indexProduct();
      console.log(`index Products by order`);
      console.log(indexaddProductResult);
    });
    afterAll(async () => {
      console.log(`orderId : ${orderId}`);
      for (
        let i = parseInt(orderId, 10);
        i < parseInt(orderId, 10) + 7;
        i += 1
      ) {
        await storeOrder.removeProduct(`${i}`, `${i + 1}`);
        const indexaddProductResult = storeOrder.indexProduct();
        console.log(`index Products by order`);
        console.log(JSON.stringify(indexaddProductResult));
        await storeOrder.delete(`${i}`);
        const indexOrderResult = await storeOrder.index();
        console.log(`index Order :`);
        console.log(indexOrderResult);
      }
      const indexaddProductResult = storeOrder.indexProduct();
      console.log(`index Products by order`);
      console.log(indexaddProductResult);
      const indexOrderResult = await storeOrder.index();
      console.log(`index Order :`);
      console.log(indexOrderResult);

      console.log(`productId : ${productId}`);
      for (
        let i = parseInt(productId, 10);
        i < parseInt(productId, 10) + 7;
        i += 1
      ) {
        await storeProduct.delete(`${i}`);
      }
      const indexProductResult = await storeProduct.index();
      console.log(`index Product :`);
      console.log(indexProductResult);

      await storeUser.delete(userId);
      const indexUserResult = await storeUser.index();
      console.log(`Index User : `);
      console.log(indexUserResult);
    });
    it('should return the top 5 most popular products ', async () => {
      const fiveMostWantedResult = await store.fiveMostWanted();
      console.log(`fiveMostWantedResult : `);
      console.log(fiveMostWantedResult);
    });
  });
});
