import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { TProduct } from '@/types/product.type';
import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';


type TProductItemProps = {
  item: TProduct;
};
const ProductItem = ({ item }: TProductItemProps) => {
  const { id, name, imageUrl, price, rating, inStock, reviewsCount } = item;
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i < rating
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
      <Card
        key={id}
        className={cn("group overflow-hidden border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 max-w-md ")}
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {loading && <CardItemSkeleton />}
          <img
            onLoad={() => setLoading(false)}
            src={imageUrl}
            alt={name}
            className={cn("h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-100", {
              'opacity-0': loading,
            })}
          />
          {price && !loading && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-500">
              {formatPrice(price)}
            </Badge>
          )}
          {!inStock && !loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm font-semibold">
                Fora de Estoque
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            {renderStars(rating)}
            <span className="text-xs text-slate-500">({reviewsCount})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {formatPrice(price)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-slate-900 hover:bg-slate-800 transition-colors"
            disabled={!inStock}
            onClick={() => addToCart(item)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
          </Button>
        </CardFooter>
      </Card>
  );
};

const CardItemSkeleton = () => {
  return (
    <div className="animate-pulse max-w-md min-w-md w-full border border-zinc-400 rounded-lg overflow-hidden h-[398px]">
      <Skeleton className="bg-zinc-400 h-[358px] w-full"></Skeleton>

    </div>
  );
};

export default ProductItem;