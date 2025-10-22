import { InternalServerError, NotFoundError } from '@/core/Errors/error';
import { TProduct } from '@/types/product.type';
import { IndexedDbConnection } from '../indexedDbConnection';

export class ProductRepository {
  constructor(private dbConnection: IndexedDbConnection) {}

  public async addProduct(product: TProduct): Promise<string> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readwrite');
      const store = transaction.objectStore('products');
      const productExists = store.get(product.id);
      productExists.onsuccess = () => {
        if (productExists.result) {
          // Comentando pois não vai ter adiçao manual de produtos
          // reject(new InternalServerError('Produto já existe'));
          resolve('Produto já existe');
        }
      };
      productExists.onerror = () => {
        reject(new InternalServerError(`Erro ao verificar produto existente: ${productExists.error}`));
      }
      const request = store.add(product);

      request.onsuccess = () => {
        resolve(request.result as string);
      };

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao adicionar produto: ${request.error}`));
      };
    });
  }

  public async getProductByKey(key: string): Promise<TProduct | null> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readonly');
      const store = transaction.objectStore('products');
      const request = store.get(key);

      request.onsuccess = () => {
        if (!request.result) {
          reject(new NotFoundError('Produto não encontrado'));
          return;
        }
        resolve(request.result as TProduct | null);
      };

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar produto por chave: ${request.error}`));
      };
    });
  }

  public async getAllProducts(): Promise<Array<TProduct>> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('products', 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Array<TProduct>);
      };

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar todos os produtos: ${request.error}`));
      };
    });
  }
}