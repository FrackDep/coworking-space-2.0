import type { ImageSourcePropType } from 'react-native';

export type SpaceType =
  | 'escritorio-flexible'
  | 'escritorio-dedicado'
  | 'sala-juntas'
  | 'oficina-privada'
  | 'cabina-fonica'
  | 'sala-eventos';

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  description: string;
  floor: number;
  capacity: number;
  pricePerHour: number;
  available: boolean;
  image: ImageSourcePropType;
}

export const SPACE_TYPE_LABEL: Record<SpaceType, string> = {
  'escritorio-flexible': 'Escritorio flexible',
  'escritorio-dedicado': 'Escritorio dedicado',
  'sala-juntas': 'Sala de juntas',
  'oficina-privada': 'Oficina privada',
  'cabina-fonica': 'Cabina fónica',
  'sala-eventos': 'Sala de eventos',
};
