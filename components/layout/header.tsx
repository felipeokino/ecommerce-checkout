'use client';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { orderScheduler } from '@/lib';
import { appName, cn } from '@/lib/utils';
import { LogOut, Mail, Search, ShoppingCart, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';



const Header = () => {
  const pathname = usePathname()
  const {cartItems, totalAmount, cartItemsCount} = useCart()

  const { getUser } = useUser();
  const user = getUser();

  const router = useRouter()
  const handleFinishAccount = () => {
    router.push('/checkout')
  }

  useEffect(() => {
    (async () =>  {
      await orderScheduler.loadOrders(useUser().getUser().id);
    })()
  }, [])

  const handleLogout = () => {
    useUser().logout();
    router.replace('/auth')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <ShoppingCart className="h-7 w-7 text-zinc-900" />
            <span className="text-xl font-bold text-zinc-900">{appName}</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
              <a href="/products" data-active={pathname === '/products'} className={cn("text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900", {
                'text-zinc-900 font-bold': pathname === '/products'
              })}>
              Produtos
            </a>
              <a href="#" data-active={pathname === '/categorias'} className={cn("text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900", {
                'text-zinc-900': pathname === '/categorias'
              })}>
              Categorias
            </a>
              <a href="#" data-active={pathname === '/ofertas'} className={cn("text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900", {
                'text-zinc-900': pathname === '/ofertas'
              })}>
              Ofertas
            </a>
              <a href="#" data-active={pathname === '/contato'} className={cn("text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900", {
                'text-zinc-900': pathname === '/contato'
              })}>
              Contato
            </a>
          </nav>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              placeholder="Buscar produtos..."
              className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-10 pr-4 text-sm transition-colors focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-zinc-100">
                <User className="h-5 w-5 text-zinc-700" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="end">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Minha Conta</h4>
                  <Separator className="mb-3" />
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-2'><User className='w-4 h-4' /><span>{user?.name}</span></div>
                  <div className='flex items-center gap-2'><Mail className='w-4 h-4' /><span>{user?.email}</span></div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-zinc-700 hover:text-zinc-900 transition-colors">
                    Meus Pedidos
                  </a>
                  <a href="#" className="block text-zinc-700 hover:text-zinc-900 transition-colors">
                    Lista de Desejos
                  </a>
                  <a href="#" className="block text-zinc-700 hover:text-zinc-900 transition-colors">
                    Configurações
                  </a>
                  <Button variant="default" className="w-full mt-2" onClick={handleLogout}>
                    <LogOut  />
                    Sair
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-zinc-100">
                <ShoppingCart className="h-5 w-5 text-zinc-700" />
                {cartItemsCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-zinc-900 hover:bg-zinc-900"
                    variant="default"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-3">
                  Carrinho de Compras ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'})
                </h4>
                <Separator />
              </div>

              {cartItems.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Seu carrinho está vazio
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px]">
                    <div className="px-4 space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.item.id} className="flex gap-3 py-2">
                          <img
                            src={item.item.imageUrl}
                            alt={item.item.name}
                            className="h-16 w-16 rounded-md object-cover border"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm text-zinc-900 truncate">
                              {item.item.name}
                            </h5>
                            <p className="text-xs text-zinc-500 mt-1">
                              Quantidade: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-zinc-900 mt-1">
                              R$ {(item.item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 space-y-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">Total</span>
                      <span className="text-xl font-bold text-zinc-900">
                        R$ {totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <Button className="w-full bg-zinc-900 hover:bg-zinc-800" size="lg" onClick={handleFinishAccount}>
                      Finalizar Compra
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Ver Carrinho
                    </Button>
                  </div>
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}

export default Header