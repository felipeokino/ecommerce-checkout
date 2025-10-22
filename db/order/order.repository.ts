import { InternalServerError } from '@/core/Errors/error';
import { TOrder } from '@/types/order.type';
import { IndexedDbConnection } from '../indexedDbConnection';

export class OrderRepository {
  constructor(private dbConnection: IndexedDbConnection) {}

  public async addOrder(order: TOrder): Promise<string> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('orders', 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.add(order);

      request.onsuccess = () => {
        resolve(request.result as string);
      };


      request.onerror = () => {
        reject(`Erro ao adicionar pedido: ${request.error}`);
      };
    });
  }

  public async getOrderById(orderId: string): Promise<TOrder | null> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('orders', 'readonly');
      const store = transaction.objectStore('orders');
      const request = store.get(orderId);

      request.onsuccess = () => {
        resolve(request.result as TOrder | null);
      };


      request.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar pedido por ID: ${request.error}`));
      };
    });
  }

  public async getOrdersByUserId(userId: number): Promise<TOrder[]> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('orders', 'readonly');
      const store = transaction.objectStore('orders');
      const orders: TOrder[] = [];
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.userId === userId) {
            orders.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(orders);
        }
      }

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar pedidos por ID de usuário: ${request.error}`));
      };
    });
  }

  public async getPendingOrders(userId: string): Promise<TOrder[]> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('orders', 'readonly');
      const store = transaction.objectStore('orders');
      const orders: TOrder[] = [];
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.status === 'pending' && cursor.value.userId === userId) {
            orders.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(orders);
        }
      }

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar pedidos pendentes: ${request.error}`));
      };
    });
  }

  public async updateOrderStatus({id, status}: {id: string; status: string}): Promise<void> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('orders', 'readwrite');
      const store = transaction.objectStore('orders');
      const getOrder = store.get(id);
      
      getOrder.onsuccess = () => {
        const order = getOrder.result;
        const request = store.put({ ...order, status });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao atualizar pedido: ${request.error}`));
      };
      };

      getOrder.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar pedido para atualização: ${getOrder.error}`));
      };
    });
  }
}