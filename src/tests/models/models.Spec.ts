import { ProductStore } from '../../models/products';

const store = new ProductStore();

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });
  it('should have an show method', () => {
    expect(store.show).toBeDefined();
  });
  it('should have an create method', () => {
    expect(store.create).toBeDefined();
  });
  it('should have an delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should add a product', async () => {
    const result = await store.create({
      id: 1,
      name: 'Twingo',
      price: 12000,
      category: 'car',
    });
    expect(result).toEqual({
      id: 1,
      name: 'Twingo',
      price: 12000,
      category: 'car',
    });
  });
  it('index should return a list ', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: 'Twingo',
        price: 12000,
        category: 'car',
      },
    ]);
  });
  it('show method should return the correct product', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      name: 'Twingo',
      price: 12000,
      category: 'car',
    });
  });
  it('delete method should remove the book', async () => {
    const result = await store.delete('1');
    expect(result).toEqual({
      id: 1,
      name: 'Twingo',
      price: 12000,
      category: 'car',
    });
  });
});
