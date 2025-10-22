import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, QrCode } from "lucide-react";

// Importar os componentes de formulário (necessários para shadcn/ui Form)
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TOrder } from '@/types/order.type';
import { cardNumberMask } from '@/utils/masks';
import { cardSchema } from '@/validators/card.validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Loading from '../ui/loading';


export const PixPayment = ({ total, pixDiscount, onFinish }: { total: number; pixDiscount: number; onFinish: (status: TOrder['status']) => void; }) => {
  const [loading, setLoading] = useState(false);
  const handleFinish = () => {
    setLoading(true);
    // simular confirmação de pagamento
    setTimeout(() => {
      setLoading(false);
      const chance = Math.random();
      onFinish(chance > 0.7 ? 'completed' : chance > 0.3 ? 'pending' : 'failed');
    }, 3000);
  };

  return (
    <Card className="p-4 border-2 border-primary/50 bg-primary/5">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg flex items-center">
          <QrCode className="w-5 h-5 mr-2 text-primary" />
          Pagamento via Pix
        </CardTitle>
        <p className="text-sm text-green-600 font-semibold">
          Você economiza R$ {pixDiscount.toFixed(2)} com 5% de desconto!
        </p>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div className="text-center p-4 border rounded-lg bg-white">
          <div className="w-32 h-32 mx-auto bg-gray-200 flex items-center justify-center rounded-lg">
            <QrCode className="w-8 h-8 text-gray-500" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Escaneie o código acima</p>
        </div>

        <Button variant="outline" className="w-full">
          Copiar Código Pix
        </Button>

        <p className="text-xs text-red-500 text-center mt-2">
          Vencimento: 30 minutos após a geração.
        </p>
        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
          <span>Total a Pagar:</span>
          <span className="text-primary">R$ {total.toFixed(2)}</span>
        </div>


        <div className="flex flex-col items-center text-xs text-muted-foreground justify-center mt-3">
          Após o pagamento, confirme clicando no botão abaixo.
          <Button type="button" className="max-w-1/4 w-full mt-6" onClick={handleFinish} disabled={loading}>
            Concluir
            {loading && <Loading size='small' />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const CardPaymentForm = ({ type, total, onFinish }: { type: 'credit' | 'debit'; total: number; onFinish: (status: TOrder['status']) => void; }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(cardSchema),
  });

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

  const onSubmit = () => {
    // simular processamento de pagamento
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const chance = Math.random();
      
      onFinish(chance > 0.7 ? 'completed' : chance > 0.3 ? 'pending' : 'failed');
    }, 3000);
  };
  useEffect(() => {
    form.setValue('type', type);
  }, [type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h3 className="text-md font-semibold mb-3">
          Informações do Cartão de {type === 'credit' ? 'Crédito' : 'Débito'}
        </h3>

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Cartão</FormLabel>
              <FormControl>
                <Input placeholder="0000 0000 0000 0000" value={field.value} onChange={e => field.onChange(cardNumberMask(e.target.value || ''))} maxLength={19} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Impresso no Cartão</FormLabel>
              <FormControl>
                <Input placeholder="Nome Completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="expMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expYear"
            render={({ field }) => (
              <FormItem className='mt-2 md:mt-0'>
                <FormLabel className='opacity-0'>Ano</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} maxLength={4} />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className='cursor-help' title="Código de 3 ou 4 dígitos no verso do cartão.">ⓘ</span>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {type === 'credit' && (
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcelamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o número de parcelas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1x de R$ {total.toFixed(2)} (À vista)</SelectItem>
                    <SelectItem value="3">3x de R$ {(total / 3).toFixed(2)} Sem Juros</SelectItem>
                    <SelectItem value="6">6x de R$ {(total / 6).toFixed(2)} Com Juros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="max-w-1/4 w-full mt-6" disabled={loading}>
          Concluir Pedido - R$ {total.toFixed(2)}
          {loading && <Loading size='small' />}
        </Button>


        <div className="flex items-center text-xs text-muted-foreground justify-center mt-3">
          <Lock className="w-3 h-3 mr-1" />
          Transação Segura com Criptografia
        </div>
      </form>
    </Form>
  );
};
