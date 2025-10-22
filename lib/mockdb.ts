import { ProductRepository } from '@/db/product/product.repository';
import { TProduct } from '@/types/product.type';

export class MockDb {
  constructor(private productRepository: ProductRepository) {}

  public async seedProducts(products: Array<TProduct>): Promise<void> {
    await Promise.all(
      products.map(async (product) => {
        await this.productRepository.addProduct(product);
      })
    );
  }
}