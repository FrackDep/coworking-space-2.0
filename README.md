# Semana 05 — Networking y TanStack Query v5

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-05`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-04` y le suma lo de esta semana, así que la historia de la rama son
los 5 commits de las semanas 01 a 05.

## Qué pide el bootcamp

1. `useQuery` consumiendo al menos un endpoint real del dominio
2. `useMutation` con `invalidateQueries` en `onSuccess`
3. Manejo de loading, error y empty states en `HomeScreen`
4. Pull-to-refresh funcional
5. README con descripción del dominio, API usada y capturas de pantalla

## Qué implementé

- **`src/services/api.ts`:** instancia de Axios con `baseURL` configurable por la
  variable de entorno `EXPO_PUBLIC_API_URL`, `timeout` de 10 s, cabeceras JSON e
  interceptor de respuesta que registra los errores de red.
- **Hooks de datos** en `src/hooks/useSpaces.ts`: `useSpaces` (lista),
  `useSpaceById` (detalle, con `enabled`) y `useCreateSpace` (`useMutation` que
  invalida la query de la lista en `onSuccess`).
- **`src/utils/spaceMapper.ts`:** traduce cada respuesta de la API a un `Space`
  del dominio. El `id` decide el tipo de espacio y la sala, y de ahí salen piso,
  capacidad, precio en COP y disponibilidad.
- **`HomeScreen` con los cuatro estados de red:** `ActivityIndicator` mientras
  carga, mensaje de error con botón *Reintentar*, estado vacío diferenciado (sin
  espacios publicados vs. sin resultados de búsqueda) y pull-to-refresh con
  `onRefresh={refetch}` y `refreshing={isFetching}`.
- **`DetailScreen`** que pide el espacio a la API por id, con su propio estado de
  carga y de error.
- **`CreateScreen`** con un formulario que envía un `POST` y vuelve atrás cuando
  la mutación termina bien.
- **`QueryClientProvider`** en `App.tsx` con `staleTime` de 2 minutos, `retry: 2`
  y sin `refetchOnWindowFocus`.
- **Se elimina `mockData`:** el catálogo ya no vive en el celular, se pide por red.

## La API

[JSONPlaceholder](https://jsonplaceholder.typicode.com), el servicio de práctica
que sugiere el bootcamp. Responde `{ id, userId, title, body }`.

| Operación | Endpoint | Hook |
| --- | --- | --- |
| Listar espacios | `GET /posts?_limit=20` | `useSpaces()` |
| Ver un espacio | `GET /posts/:id` | `useSpaceById(id)` |
| Publicar un espacio | `POST /posts` | `useCreateSpace()` |

El `POST` responde con un objeto simulado (id 101 y siguientes), que es el
comportamiento esperado de esa API de práctica: no guarda de verdad. Para apuntar
a una API propia basta con definir `EXPO_PUBLIC_API_URL`.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 982 módulos |
| Mapeo probado con las 20 respuestas reales del endpoint | 20 espacios, 6 tipos, 5 pisos, ids únicos |
| Contrato de la API comprobado | `GET /posts?_limit=20` → 20 elementos · `POST /posts` → id 101 |

## Estructura de esta semana

```
semana-05/  (raíz del repositorio)
├── App.tsx                        QueryClientProvider + NavigationContainer
├── index.js                       Registro del componente raíz
├── app.json                       Configuración de Expo
├── package.json                   Dependencias (Axios + TanStack Query)
└── src/
    ├── components/ItemCard.tsx    Tarjeta que navega al detalle
    ├── hooks/useSpaces.ts         useQuery / useSpaceById / useCreateSpace
    ├── navigation/
    │   ├── RootNavigator.tsx      Tab + Stack (ahora con HomeCreate)
    │   └── types.ts               Listas de params tipadas
    ├── screens/
    │   ├── HomeScreen.tsx         Lista con estados de red y refresh
    │   ├── DetailScreen.tsx       Detalle desde la API
    │   ├── CreateScreen.tsx       Formulario que hace POST
    │   └── SavedScreen.tsx        Guardados (Zustand, semana 04)
    ├── services/api.ts            Instancia de Axios
    ├── stores/savedStore.ts       Estado global (Zustand)
    ├── theme/index.ts             COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts             Space · SpacePost · CreateSpacePayload
    └── utils/
        ├── format.ts              Precios COP y capacidad
        └── spaceMapper.ts         API → dominio
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-05
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

Esta semana **necesita internet**: el catálogo se carga desde la API. Si el
teléfono no tiene red, verás el estado de error con el botón *Reintentar* (la
caché offline llega en la semana 07).

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
| `05-crear.png` | Formulario de publicación | Tocar el `+` del header |
| `05-error.png` | Estado de error con *Reintentar* | Abrir la app sin internet |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-05`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 05 — Networking y TanStack Query`
