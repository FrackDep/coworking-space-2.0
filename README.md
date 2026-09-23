# Semana 02 — Listas, Inputs y Estilos

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-02`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-01` y le suma lo de esta semana, así que la historia de la rama son
los 2 commits de las semanas 01 a 02.

## Qué pide el bootcamp

1. App funcional en simulador iOS y/o Android
2. Al menos 10 items del dominio asignado en `mockData.ts`
3. Búsqueda funcionando en tiempo real
4. `README.md` en la raíz de tu entrega con: descripción del dominio, captura de
   pantalla (o descripción de las pantallas) y decisiones de diseño tomadas

**Criterios de la rúbrica:** `keyExtractor` por id, `useMemo`, `useCallback`,
`ItemSeparatorComponent`, `KeyboardAvoidingView`, constantes de tema y ningún
`any`.

## Qué implementé

- **Catálogo de 12 espacios** (2 por cada tipo del dominio) con descripción,
  piso, capacidad, precio por hora y badge de disponibilidad.
- **Búsqueda en tiempo real** con `TextInput` y `useMemo`: filtra por nombre,
  tipo de espacio, descripción y piso, sin recalcular en cada render.
- **Estado vacío** cuando la búsqueda no encuentra nada, mostrando el término
  buscado. Es texto, sin íconos: los Ionicons llegan en la semana 03.
- **`FlatList` virtualizada** con `keyExtractor` por id, `useCallback` en
  `renderItem` y en el estado vacío, y `ItemSeparatorComponent` entre tarjetas.
- **`KeyboardAvoidingView`** para que el teclado no tape la lista.
- **Sistema de tema centralizado** en `src/theme` (COLORS, TYPOGRAPHY, SPACING,
  RADIUS): todos los `StyleSheet` leen de ahí, sin colores ni medidas sueltas.
- **Corrección de compilación:** la prop `backgroundColor` de `expo-status-bar`
  ya no existe en el SDK 57 y rompía el archivo del starter; aquí se omite.

## Decisiones de diseño

| Decisión | Por qué |
| --- | --- |
| Buscar también por piso y tipo, no solo por nombre | En un edificio de 5 pisos la gente busca "piso 3" o "cabina", no el nombre exacto de la sala |
| Badge *Disponible / Ocupado* visible en la tarjeta | Es la información que más se consulta al reservar |
| Tema centralizado en lugar de estilos sueltos | Evita repetir colores y permite cambiar el aspecto en un solo archivo |

## Estructura de esta semana

```
semana-02/  (raíz del repositorio)
├── App.tsx                      Componente raíz
├── index.js                     Registro del componente raíz
├── app.json                     Configuración de Expo
├── package.json                 Dependencias de la semana
├── assets/spaces/               Fotos locales de los 6 tipos de espacio
└── src/
    ├── components/ItemCard.tsx  Tarjeta del espacio con badge
    ├── data/mockData.ts         12 espacios del edificio
    ├── screens/HomeScreen.tsx   Buscador + FlatList + estados
    ├── theme/index.ts           COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts           Modelo Space y tipos de espacio
    └── utils/format.ts          Formato de precios COP y capacidad
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-02
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 591 módulos |

## Ejecutar en web

La entrega también se abre en el navegador, sin emulador ni teléfono:

```bash
pnpm install     # una vez por rama
pnpm web         # abre la app en http://localhost:8081
```

Para generar la versión estática (queda en `dist-web/`):

```bash
pnpm exec expo export --platform web
```


## Capturas de esta semana

| Archivo | Pantalla | Cómo llegar |
| --- | --- | --- |
| `02-busqueda.png` | Buscador filtrando | Escribir `sala` en el buscador |
| `02-estado-vacio.png` | Estado vacío | Escribir `zzz` en el buscador |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-02`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 02 — Listas, Inputs y Estilos`
