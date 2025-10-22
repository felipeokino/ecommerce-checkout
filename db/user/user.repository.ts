import { DuplicateEntryError, InternalServerError, NotFoundError } from '@/core/Errors/error';
import { TUser } from '@/types/user.type';
import { IndexedDbConnection } from '../indexedDbConnection';

export class UserRepository {
  constructor(private dbConnection: IndexedDbConnection) {}

  public async addUser(user: TUser): Promise<number> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('users', 'readwrite');
      const store = transaction.objectStore('users');
      const getUserRequest = store.index('email').get(user.email);

      getUserRequest.onsuccess = () => {
        const existingUser = getUserRequest.result;
        if (existingUser) {
          reject(new DuplicateEntryError('Email já cadastrado'));
          return;
        }
        const request = store.add(user);
        request.onsuccess = () => {
          resolve(request.result as number);
        };

        request.onerror = () => {
          reject(new InternalServerError(`Erro ao adicionar usuário: ${request.error}`));
        };
      }
      getUserRequest.onerror = () => {
        reject(new InternalServerError(`Erro ao verificar usuário: ${getUserRequest.error}`));
      };
    });
  }
  public async getUserByEmail(email: string): Promise<TUser | null> {
    const db = await this.dbConnection.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('users', 'readonly');
      const store = transaction.objectStore('users');
      const request = store.index('email').get(email);
      request.onsuccess = () => {
        if (!request.result) {
          reject(new NotFoundError('Usuário não encontrado'));
          return;
        }
        resolve(request.result as TUser | null);
      };

      request.onerror = () => {
        reject(new InternalServerError(`Erro ao buscar usuário por email: ${request.error}`));
      };
    });
  }

  public async validateUser(email: string, password: string): Promise<Omit<TUser, 'password'> | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}