export type TOrder = {
  id: string,
  userId: string,
  productKeys: { id: string, quantity: number }[],
  totalAmount: number,
  status: 'completed' | 'failed' | 'pending',
}