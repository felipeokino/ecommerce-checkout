import z from 'zod';

export const SignupSchema = z.object({
  name: z.string('Campo obrigatório').min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string('Campo obrigatório').email('Email inválido'),
  password: z.string('Campo obrigatório').min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type SignupValidator = z.infer<typeof SignupSchema>;