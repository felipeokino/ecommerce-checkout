import { productRepository } from '@/lib';
import { TProduct } from '@/types/product.type';
import { useEffect, useState } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchProducts = async () => {
    const response = await productRepository.getAllProducts()
    return response
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const productsData = await fetchProducts();
      setProducts(productsData);
      setLoading(false);
    })()
  }, [])


  return { products, loading };
}