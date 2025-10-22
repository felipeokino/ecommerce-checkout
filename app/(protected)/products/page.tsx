'use client'

import AuthGuard from '@/components/layout/authGuard';
import { ProductGrid } from '@/components/layout/productGrid';
import { useProducts } from '@/hooks/useProducts';

const Products = () => {
  const {products, loading} = useProducts()

  return (
    <AuthGuard>
      <ProductGrid products={products} />
    </AuthGuard>
  )
}

export default Products