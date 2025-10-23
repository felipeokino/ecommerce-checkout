import { orderRepository } from '@/lib';
import { toast } from 'sonner';

const toastCallback = (orderId: string, isCompleted: boolean, callback: () => void) => {
  toast(`Pagamento ${isCompleted ? 'confirmado' : 'falhou'} - Pedido ${orderId}`, {
      description: new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date()),
      action: {
        label: isCompleted ? "Fechar" : "Tentar Novamente",
        onClick: callback,
      },
      cancel: true,
    })
}
export class OrderScheduler {
  private schedules: Map<string, NodeJS.Timeout> = new Map();
  private interval: number;

  constructor(interval: number = 60000) {
    this.interval = interval;
  }

  async loadOrders(userId: string) {
    if (!userId) return;
    await orderRepository.getPendingOrders(userId).then(orders => {
      orders.forEach(order => {
        const isCompleted = Math.random() < 0.5;

        if (isCompleted) {
          orderRepository.updateOrderStatus({id: order.id, status: 'completed'});
        }
        this.scheduleOrder(order.id, () => {
          toastCallback(order.id, isCompleted, isCompleted ? () => console.log("Fechar") : () => this.loadOrders(order.userId));
        });
    });
    });
  }
  scheduleOrder(orderId: string, callback: () => void) {
    if (this.schedules.has(orderId)) {
      clearTimeout(this.schedules.get(orderId)!);
    }
    const timeout = setTimeout(() => {
      callback();
      this.schedules.delete(orderId);
    }, this.interval);
    this.schedules.set(orderId, timeout);
  }

  cancelOrder(orderId: string) {
    if (this.schedules.has(orderId)) {
      clearTimeout(this.schedules.get(orderId)!);
      this.schedules.delete(orderId);
    }
  }
}