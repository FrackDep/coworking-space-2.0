# Semana 07 — Persistencia Local

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-07`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-06` y le suma lo de esta semana, así que la historia de la rama son
los 7 commits de las semanas 01 a 07.

## Qué pide el bootcamp

1. **`usePreferences` (MMKV):** al menos 3 preferencias reactivas que persistan
   sin `async/await` y sin reiniciar la app
2. **Caché offline en `useItems` (AsyncStorage):** guardar cuando hay red, leer
   de la caché cuando falla, y mostrar el banner de "sin red" en `HomeScreen`
3. **`SettingsScreen`:** controles para cada preferencia que persistan en tiempo
   real, más una sección de seguridad con un dato sensible que **no** aparezca en
   texto plano
4. **`HomeScreen` actualizado:** aplicar el orden de las preferencias, el modo
   compacto y mostrar los items cacheados con su banner cuando no hay red

## Qué implementé

- **`src/storage/mmkv.ts`:** capa de almacenamiento con la API de MMKV. Detecta
  si el módulo nativo está disponible (con un latido de escritura/lectura), usa
  AsyncStorage como respaldo cuando no lo está y expone un sistema de
  suscripción para que los cambios de preferencias viajen solos entre pantallas.
- **`usePreferences`** con tres preferencias reactivas y persistidas:

  | Preferencia | Valores | Efecto |
  | --- | --- | --- |
  | `sortOrder` | nombre · precio · piso | Ordena el catálogo |
  | `compactMode` | activado / desactivado | Muestra solo nombre y precio en cada tarjeta |
  | `itemsPerPage` | 5 · 10 · 20 | Cuántos espacios se listan |

- **Caché offline en `useSpaces`:** después de cada respuesta correcta guarda el
  catálogo en AsyncStorage; si la red falla, sirve esa copia y activa el banner
  **"Mostrando datos sin red"**. El caché guarda solo datos: las imágenes se
  reconstruyen desde el tipo de espacio al leerlas.
- **`SettingsScreen`** (pestaña *Ajustes*): las tres preferencias se guardan al
  instante, sin botón de guardar, y se añade la sección **Seguridad** con Expo
  SecureStore para guardar y comprobar el código de acceso del edificio. El
  código nunca se muestra: la pantalla solo confirma si hay uno guardado.
- **`ItemCard`** con modo compacto y **`HomeScreen`** aplicando orden, modo
  compacto y el límite de espacios por página.

## Nota técnica: MMKV y Expo Go

`react-native-mmkv` es un módulo JSI/Nitro: **no existe dentro de Expo Go**, así
que un `require` de MMKV ahí falla. `src/storage/mmkv.ts` coge el error y
continúa con AsyncStorage, manteniendo la misma API y la misma reactividad, y la
pantalla *Ajustes* indica cuál de los dos almacenamientos está activo. Para usar
MMKV de verdad hace falta un development build (`pnpm expo run:android` con el
SDK de Android instalado, o `eas build --profile development`).

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 1116 módulos |
| Los tres órdenes probados en Node con 20 espacios | nombre, precio y piso ordenan correctamente |
| Ida y vuelta de la caché | 20 espacios recuperados, 0 pérdidas, imágenes reconstruidas desde el tipo |

## Estructura de esta semana

```
semana-07/  (raíz del repositorio)
├── App.tsx                        QueryClient + Navigation + hidratación
├── index.js                       Registro del componente raíz
├── app.json                       Configuración de Expo
├── package.json                   Dependencias (MMKV, SecureStore, AsyncStorage)
└── src/
    ├── components/
    │   ├── FormField.tsx          Controller + TextInput + error
    │   └── ItemCard.tsx           Tarjeta con modo compacto
    ├── hooks/
    │   ├── usePreferences.ts      Preferencias MMKV reactivas
    │   └── useSpaces.ts           useQuery con caché offline
    ├── navigation/
    │   ├── RootNavigator.tsx      Tab (Espacios · Guardados · Ajustes) + Stack
    │   └── types.ts               Listas de params tipadas
    ├── schemas/spaceSchema.ts     Reglas Zod de los formularios
    ├── screens/
    │   ├── HomeScreen.tsx         Lista con banner sin red y preferencias
    │   ├── DetailScreen.tsx       Detalle del espacio
    │   ├── CreateScreen.tsx       Creación validada
    │   ├── EditScreen.tsx         Edición con reset()
    │   ├── SavedScreen.tsx        Guardados (Zustand)
    │   └── SettingsScreen.tsx     Preferencias + SecureStore
    ├── services/api.ts            Instancia de Axios
    ├── storage/mmkv.ts            MMKV con respaldo y suscripciones
    ├── stores/savedStore.ts       Estado global (Zustand)
    ├── theme/index.ts             COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts             Modelos y payloads del dominio
    └── utils/
        ├── format.ts              Precios COP y capacidad
        ├── spaceCache.ts          Serialización de la caché
        ├── spaceMapper.ts         API → dominio
        └── sortSpaces.ts          Los tres órdenes del catálogo
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-07
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

Esta rama contiene la app completa del bootcamp hasta la semana 07: es la
versión más avanzada de Nido Coworking con el catálogo por red, formularios,
estado global y persistencia local.

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

En web no existen MMKV ni SecureStore (son módulos nativos): las preferencias usan
el almacenamiento del navegador (localStorage) a través de la misma API del
proyecto (`src/storage/safeStorage.ts`) y la pantalla **Ajustes** indica cuál está
activo. Los datos sensibles se guardan en `src/storage/secureStore.ts`, que usa el
llavero del dispositivo en iOS/Android y localStorage en web. Si el navegador
bloquea ese almacenamiento (por ejemplo dentro de un iframe con `sandbox`), la app
no falla: detecta el bloqueo y continúa con memoria temporal durante la sesión.


## Capturas de esta semana

| Archivo | Pantalla | Cómo llegar |
| --- | --- | --- |
| `07-ajustes.png` | Preferencias y sección de seguridad | Pestaña *Ajustes* |
| `07-offline.png` | Banner de datos sin red | Abrir la app en modo avión |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-07`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 07 — Persistencia Local`
