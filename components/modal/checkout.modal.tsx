import { cn } from '@/lib/utils';
import { TOrder } from '@/types/order.type';
import { CheckCircle, InfoIcon, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

type ChekoutModalProps = {
  status: TOrder['status'] | null;
  onClose: () => void;
  orderId: string;
  totalPaid: number;
}

const strings: Record<string, Record<TOrder['status'], string>> = {
  title: {
    completed: 'Pedido Confirmado!',
    failed: 'Erro no Pedido',
    pending: 'Pedido em Análise',
  },
  description: {
    completed: 'Seu pedido foi processado com sucesso.',
    failed: 'Ocorreu um erro ao processar seu pedido.',
    pending: 'Seu pedido está sendo analisado. Você será notificado em breve.',
  },
  button: {
    completed: 'Concluir',
    failed: 'Voltar e Tentar Novamente',
    pending: 'Fechar',
  }
}

export const CheckoutModal = ({ status, onClose, orderId, totalPaid }: ChekoutModalProps) => {
  const formattedTotal = totalPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const router = useRouter()
  const handleClose = () => {
    if (status === 'completed') {
      router.push('/products')
    } else {
      onClose()
    }
  }
    return (
        <Dialog open={!!status} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] text-center p-8">
                
                <div className="flex justify-center mb-4">
                    {status === 'completed' ? <CheckCircle className="w-16 h-16 text-green-500" /> : status === 'pending' ? <InfoIcon className="w-16 h-16 text-yellow-500" /> : <XCircle className="w-16 h-16 text-red-500" />}
                </div>

                <DialogHeader className="space-y-2">
                    <DialogTitle className={cn("text-3xl font-bold text-red-600 text-center", {
                      'text-green-600': status === 'completed',
                      'text-yellow-600': status === 'pending',
                    })}>
                        {strings.title[status || 'pending'] || 'Erro no Pedido'}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-center">
                        {strings.description[status || 'pending'] || 'Ocorreu um erro ao processar seu pedido.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 p-4 bg-gray-50 border rounded-lg text-left">
                    <h3 className="font-semibold mb-2">Detalhes do Pedido</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Número do Pedido:</span>
                        <span className="font-medium">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-xl mt-3 pt-2 border-t font-bold">
                        <span>Total:</span>
                        <span className={cn("text-green-600", {
                          'text-zinc-600': status === 'failed',
                          'text-yellow-600': status === 'pending',
                        })}>{formattedTotal}</span>
                    </div>
                </div>

                {status === 'completed' && <p className="text-sm text-gray-500 mt-4">
                    Você receberá um email de confirmação com os detalhes da entrega em breve.
                </p>}

                <DialogFooter className="mt-6 flex-col sm:flex-col space-y-2">
                    <Button onClick={handleClose} className="w-full">
                        {strings.button[status || 'pending'] || 'Voltar e Tentar Novamente'}
                    </Button>
                    {status === 'completed' && <Button variant="outline" onClick={() => console.log("Navegar para Acompanhar Pedido")} className="w-full">
                      Acompanhar Pedido
                    </Button>}
                </DialogFooter>
                
            </DialogContent>
        </Dialog>
    );
}

