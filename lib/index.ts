import { OrderScheduler } from '@/core/orderScheduler';
import { IndexedDbConnection } from '@/db/indexedDbConnection';
import { OrderRepository } from '@/db/order/order.repository';
import { ProductRepository } from '@/db/product/product.repository';
import { UserRepository } from '@/db/user/user.repository';
import { productsList } from '@/mocks/products.mock';
import { MockDb } from './mockdb';

const connection = new IndexedDbConnection("appDatabase", 1);
const userRepository = new UserRepository(connection);
const productRepository = new ProductRepository(connection);
const orderRepository = new OrderRepository(connection);
const orderScheduler = new OrderScheduler(60 * 1000);

(async () => {
  const mockDb = new MockDb(productRepository);
  await mockDb.seedProducts(productsList);
})();


export { orderRepository, orderScheduler, productRepository, userRepository };

