import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(2, 'El usuario debe tener al menos 2 caracteres')
    .max(50, 'El usuario no puede superar 50 caracteres')
    .trim(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'El usuario debe tener al menos 3 caracteres')
      .max(30, 'El usuario no puede superar 30 caracteres')
      .regex(/^[a-z0-9._-]+$/, 'Usa solo minúsculas, números, punto, guion o guion bajo')
      .trim(),
    email: z
      .string()
      .email('Ingresa un correo electrónico válido')
      .toLowerCase(),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña es demasiado larga')
      .regex(/[A-Za-z]/, 'Incluye al menos una letra')
      .regex(/[0-9]/, 'Incluye al menos un número'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
