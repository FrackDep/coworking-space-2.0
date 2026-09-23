import { z } from 'zod';

export const spaceSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre necesita al menos 3 caracteres')
    .max(80, 'Máximo 80 caracteres'),

  description: z
    .string()
    .min(10, 'Describe el espacio en al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),

  type: z.enum(
    [
      'escritorio-flexible',
      'escritorio-dedicado',
      'sala-juntas',
      'oficina-privada',
      'cabina-fonica',
      'sala-eventos',
    ],
    { message: 'Elige un tipo de espacio' },
  ),

  floor: z.coerce
    .number({ message: 'El piso es obligatorio' })
    .int('El piso debe ser un número entero')
    .min(1, 'El piso va del 1 al 10')
    .max(10, 'El piso va del 1 al 10'),

  capacity: z.coerce
    .number({ message: 'La capacidad es obligatoria' })
    .int('La capacidad debe ser un número entero')
    .min(1, 'La capacidad mínima es 1 persona')
    .max(40, 'La capacidad máxima del edificio es 40 personas'),

  pricePerHour: z.coerce
    .number({ message: 'El precio es obligatorio' })
    .positive('El precio debe ser mayor que 0')
    .max(500_000, 'Máximo $ 500.000 COP por hora'),
});

export type SpaceFormInput = z.input<typeof spaceSchema>;
export type SpaceFormData = z.output<typeof spaceSchema>;
