import z from 'zod';

export const cardSchema = z.object({
  cardNumber: z.string('Campo obrigatório').min(13, 'O número do cartão deve ter pelo menos 13 dígitos').max(19, 'O número do cartão deve ter no máximo 19 dígitos'),
  expMonth: z.string('Campo obrigatório').refine((val) => {
    const month = parseInt(val, 10);
    return month >= 1 && month <= 12;
  }, 'Mês de expiração inválido'),
  expYear: z.string('Campo obrigatório').refine((val) => {
    const year = parseInt(val, 10);
    const currentYear = new Date().getFullYear();
    return year >= currentYear && year <= currentYear + 20;
  }, 'Ano de expiração inválido'),
  cvv: z.string('Campo obrigatório').refine((val) => {
    return /^\d{3,4}$/.test(val);
  }, 'CVV inválido'),
  cardName: z.string('Campo obrigatório').min(2, 'O nome no cartão deve ter pelo menos 2 caracteres'),
  type: z.enum(['credit', 'debit']),
  installments: z.string().optional(),
}).refine((data) => {
  if (data.type === 'credit') {
    return !!data.installments;
  }
  return true;
}, {
  message: 'Parcelas são obrigatórias para cartão de crédito',
  path: ['installments']
});