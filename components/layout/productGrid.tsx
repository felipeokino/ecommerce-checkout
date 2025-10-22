import { TProduct } from '@/types/product.type';
import ProductItem from './productItem';

type TProductGridProps = {
  products: TProduct[]
}
export function ProductGrid({ products }: TProductGridProps) {
  

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Produtos em Destaque</h2>
        <p className="text-slate-600">Encontre os melhores produtos com os melhores preços</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem 
            key={product.id}
            item={product}
          />
        ))}
      </div>
    </div>
  );
}
