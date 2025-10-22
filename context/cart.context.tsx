'use client'
import Loading from '@/components/ui/loading';
import { useUser } from '@/hooks/useUser';
import { TCart } from '@/types/cart.type';
import { TProduct } from '@/types/product.type';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type CartContextType = {
  cartItems: TCart[];
  addToCart: (product: TProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  totalAmount: number;
  cartItemsCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const user = useUser().getUser();
  const storageKey = `user:cart${user ? `:${user.id}` : ''}`;
  const [cartItems, setCartItems] = useState<TCart[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const persist = (cart: TCart[]) => {
    setCartItems(cart);
    localStorage.setItem(storageKey, JSON.stringify(cart));
  };

  const addToCart = (product: TProduct) => {
    const existing = cartItems.find(item => item.item.id === product.id);
    const newCart = existing
      ? cartItems.map(item =>
          item.item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { item: product, quantity: 1 }];

    persist(newCart);
  };

  const removeFromCart = (productId: string) => {
    persist(cartItems.filter(item => item.item.id !== productId));
  };

  const clearCart = () => persist([]);

  const increaseQuantity = (productId: string) => {
    const newCart = cartItems.map(item =>
      item.item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    persist(newCart);
  };

  const decreaseQuantity = (productId: string) => {
    const newCart = cartItems.flatMap(item => {
      if (item.item.id === productId) {
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return [];
      }
      return item;
    });
    persist(newCart);
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setCartItems(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className='min-w-screen min-h-screen flex justify-center items-center'><Loading size='large' /></div>;
  }
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, totalAmount: cartTotal, cartItemsCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext deve ser usado dentro de <CartProvider>');
  }
  return context;
}
