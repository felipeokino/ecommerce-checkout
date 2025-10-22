'use client';

import { useCart } from '@/hooks/useCart';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, CreditCard, QrCode } from "lucide-react";

import { CardPaymentForm, PixPayment } from '@/components/layout/paymentForm';
import { CheckoutModal } from '@/components/modal/checkout.modal';
import { useUser } from '@/hooks/useUser';
import { orderRepository, orderScheduler } from '@/lib';
import { TOrder } from '@/types/order.type';
import { useState } from 'react';
import { toast } from 'sonner';

const frete = 25.00;
const descontoPix = 0.05;



export default function CheckoutForm() {
    const { cartItems, totalAmount, clearCart } = useCart();
    const [statusModal, setStatusModal] = useState<TOrder['status'] | null>(null);
    const id = crypto.randomUUID();

    const handleFinishCheckout = (paymentResponse: TOrder['status']) => {
        orderRepository.addOrder({
            id,
            productKeys: cartItems.map(el => ({ id: el.item.id, quantity: el.quantity })),
            totalAmount,
            userId: useUser().getUser().id,
            status: paymentResponse,
        });
        if (paymentResponse === 'pending') {
            orderScheduler.loadOrders(useUser().getUser().id);
            toast.success("Pedido em análise. Você será notificado quando o pagamento for confirmado.");
        }
        if (paymentResponse === 'failed') {
            toast.error("Pagamento falhou. Por favor, tente novamente.");
        }
        if (paymentResponse === 'completed') {
            toast.success("Pagamento realizado com sucesso!");
        }
        clearCart();
        setStatusModal(paymentResponse);

    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="lg:w-2/3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Pagamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="credit" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="credit">
                                        <CreditCard className="w-4 h-4 mr-1 hidden sm:inline" /> Crédito
                                    </TabsTrigger>
                                    <TabsTrigger value="debit">
                                        <Banknote className="w-4 h-4 mr-1 hidden sm:inline" /> Débito
                                    </TabsTrigger>
                                    <TabsTrigger value="pix">
                                        <QrCode className="w-4 h-4 mr-1 hidden sm:inline" /> Pix
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-6">
                                    <TabsContent value="credit">
                                        <CardPaymentForm type="credit" total={totalAmount + frete} onFinish={handleFinishCheckout} />
                                    </TabsContent>

                                    <TabsContent value="debit">
                                        <CardPaymentForm type="debit" total={totalAmount + frete} onFinish={handleFinishCheckout} />
                                    </TabsContent>

                                    <TabsContent value="pix">
                                        <PixPayment total={((totalAmount - (totalAmount * descontoPix)) + frete)} pixDiscount={totalAmount * 0.05} onFinish={handleFinishCheckout} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:w-1/3">
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle>Resumo do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {cartItems.flatMap(el => ({ ...el.item, quantity: el.quantity })).map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>R$ {totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Frete:</span>
                                    <span>R$ {frete.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Desconto (Pix):</span>
                                    <span>- R$ {(totalAmount * descontoPix).toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-bold text-xl">
                                <span>Total:</span>
                                <span>R$ {(totalAmount + frete).toFixed(2)}</span>
                            </div>

                            <p className="text-xs text-muted-foreground text-center pt-2">
                                O valor final será R$ {((totalAmount - (totalAmount * descontoPix)) + frete).toFixed(2)} ao selecionar Pix.
                            </p>

                        </CardContent>
                    </Card>
                </div>
            </div>
            <CheckoutModal status={statusModal} onClose={() => setStatusModal(null)} orderId={id} totalPaid={totalAmount + frete} />
        </div>
    );
}