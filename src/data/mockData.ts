import type { Space } from '../types';

export const MOCK_SPACES: Space[] = [
  {
    id: '1',
    name: 'Escritorio Flexible · Ventanal Norte',
    type: 'escritorio-flexible',
    description:
      'Puesto libre junto al ventanal del piso 3. Incluye locker diario, café ilimitado y wifi de 500 Mbps.',
    floor: 3,
    capacity: 1,
    pricePerHour: 12000,
    image: require('../../assets/spaces/escritorio-flexible.jpg'),
  },
  {
    id: '2',
    name: 'Escritorio Dedicado · Ala Silenciosa',
    type: 'escritorio-dedicado',
    description:
      'Puesto fijo con monitor dual y cajonera propia, dentro de la zona de silencio del edificio.',
    floor: 3,
    capacity: 1,
    pricePerHour: 18000,
    image: require('../../assets/spaces/escritorio-dedicado.jpg'),
  },
  {
    id: '3',
    name: 'Sala de Juntas · Aurora',
    type: 'sala-juntas',
    description:
      'Sala cerrada con pantalla de 65 pulgadas, pizarra y sistema de videoconferencia listo para usar.',
    floor: 5,
    capacity: 8,
    pricePerHour: 45000,
    image: require('../../assets/spaces/sala-juntas.jpg'),
  },
  {
    id: '4',
    name: 'Oficina Privada · Nido 2A',
    type: 'oficina-privada',
    description:
      'Oficina cerrada para equipos pequeños, con escritorios regulables en altura y almacenamiento propio.',
    floor: 2,
    capacity: 3,
    pricePerHour: 60000,
    image: require('../../assets/spaces/oficina-privada.jpg'),
  },
];
