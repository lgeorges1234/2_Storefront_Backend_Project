/* eslint-disable no-await-in-loop */
import { DasboardQueris } from '../../services/dashboard';
import { Product, ProductStore } from '../../models/products';
// import { Order } from '../../models/orders';
// import OrderStates from '../../utils/enum';

const store = new DasboardQueris();
const storeProduct = new ProductStore;

describe('Dashboard queries', () => {
  describe('fiveMostWanted query', () => {
    it('should have a fiveMostWanted method', () => {
      expect(store.fiveMostWanted).toBeDefined();
    });
    beforeAll(async () => {
      for (let i = 0; i < 7; i += 1) {
        const product: Product = {
          name: `Product${i}`,
          price: i,
          category: `Category${i}`,
        };
        await storeProduct.create(product);
      }
      // for (let i = 0; i < 7; i += 1) {
      //   const order: Order = {
      //     status: ,
      //     category: `Category${i}`,
      //   };
      //   await storeProduct.create(product);
      // }
    });
    xit('should return the top 5 most popular products ', async () => {
      const fiveMostWantedResult = await store.fiveMostWanted();
      console.log(fiveMostWantedResult);
    });
  });
});
