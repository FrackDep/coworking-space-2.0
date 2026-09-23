import type { ImageSourcePropType } from 'react-native';

import { formatCapacity } from './format';
import {
  SPACE_TYPE_LABEL,
  type CreateSpacePayload,
  type Space,
  type SpacePost,
  type SpaceType,
} from '../types';

const SPACE_TYPES: SpaceType[] = [
  'escritorio-flexible',
  'escritorio-dedicado',
  'sala-juntas',
  'oficina-privada',
  'cabina-fonica',
  'sala-eventos',
];

const SPACE_IMAGE: Record<SpaceType, ImageSourcePropType> = {
  'escritorio-flexible': require('../../assets/spaces/escritorio-flexible.jpg'),
  'escritorio-dedicado': require('../../assets/spaces/escritorio-dedicado.jpg'),
  'sala-juntas': require('../../assets/spaces/sala-juntas.jpg'),
  'oficina-privada': require('../../assets/spaces/oficina-privada.jpg'),
  'cabina-fonica': require('../../assets/spaces/cabina-fonica.jpg'),
  'sala-eventos': require('../../assets/spaces/sala-eventos.jpg'),
};

const SPACE_ROOMS: Record<SpaceType, string[]> = {
  'escritorio-flexible': ['Ventanal Norte', 'Zona Lounge', 'Terraza', 'Ventanal Sur'],
  'escritorio-dedicado': ['Ala Silenciosa', 'Estudio 4B', 'Ala Creativa'],
  'sala-juntas': ['Aurora', 'Mirador', 'Roble'],
  'oficina-privada': ['Nido 2A', 'Nido 4C', 'Nido 5B'],
  'cabina-fonica': ['Individual Norte', 'Dúo Ventana', 'Individual Sur'],
  'sala-eventos': ['Auditorio', 'Taller Creativo'],
};

const SPACE_BASE_PRICE: Record<SpaceType, number> = {
  'escritorio-flexible': 10000,
  'escritorio-dedicado': 18000,
  'sala-juntas': 45000,
  'oficina-privada': 60000,
  'cabina-fonica': 6000,
  'sala-eventos': 85000,
};

const SPACE_CAPACITY: Record<SpaceType, number> = {
  'escritorio-flexible': 1,
  'escritorio-dedicado': 2,
  'sala-juntas': 8,
  'oficina-privada': 3,
  'cabina-fonica': 1,
  'sala-eventos': 16,
};

const SPACE_NOTE: Record<SpaceType, string> = {
  'escritorio-flexible':
    'Puesto libre con locker diario, café ilimitado y wifi de 500 Mbps.',
  'escritorio-dedicado':
    'Puesto fijo con monitor dual, cajonera propia y silla ergonómica.',
  'sala-juntas':
    'Sala con pantalla de 65 pulgadas, pizarra y videoconferencia lista para usar.',
  'oficina-privada':
    'Oficina cerrada con escritorios, archivador y aire acondicionado propio.',
  'cabina-fonica':
    'Cabina insonorizada para llamadas y grabaciones, con ventilación silenciosa.',
  'sala-eventos':
    'Auditorio con gradería, proyector, sonido profesional y área de catering.',
};

export function imageForType(type: SpaceType): ImageSourcePropType {
  return SPACE_IMAGE[type];
}

export function toSpace(post: SpacePost): Space {
  const type = SPACE_TYPES[(post.id - 1) % SPACE_TYPES.length];
  const rooms = SPACE_ROOMS[type];
  const room = rooms[(post.id - 1) % rooms.length];
  const floor = ((post.id - 1) % 5) + 1;
  const capacity = SPACE_CAPACITY[type] + (SPACE_CAPACITY[type] >= 3 ? post.id % 3 : 0);

  return {
    id: String(post.id),
    name: `${SPACE_TYPE_LABEL[type]} · ${room}`,
    type,
    description: `${SPACE_NOTE[type]} Piso ${floor}, hasta ${formatCapacity(capacity)}.`,
    floor,
    capacity,
    pricePerHour: SPACE_BASE_PRICE[type] + (post.id % 4) * 1000,
    available: post.id % 4 !== 0,
    image: SPACE_IMAGE[type],
  };
}

export function toPost(payload: CreateSpacePayload): Omit<SpacePost, 'id'> {
  return {
    title: payload.name,
    body: payload.description,
    userId: payload.floor,
  };
}
