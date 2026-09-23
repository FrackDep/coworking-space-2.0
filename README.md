# Semana 09 — Animaciones Básicas

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-09`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-08` y le suma lo de esta semana, así que la historia de la rama son
los 9 commits de las semanas 01 a 09.

## Qué pide el bootcamp

1. **`Animated.timing`, `Animated.spring` y `Animated.decay`** con sus sensaciones
   distintas
2. **Combinar animaciones:** `Animated.parallel`, `Animated.sequence` y
   `Animated.stagger`
3. **`interpolate`** para animar lo que no es numérico: colores, rotaciones,
   escalas y anchos
4. **`LayoutAnimation`** para animar cambios de layout, con el flag de Android
5. **Cinco comportamientos en el proyecto:** entrada del detalle, feedback
   táctil en las tarjetas, barra de progreso, entrada en cascada de la lista y
   animación de layout al agregar o quitar elementos
6. **Nada de `useNativeDriver: false` donde debe ser `true`**

## Qué implementé

Los cinco comportamientos exigidos, aplicados al dominio del edificio:

| # | Comportamiento | Dónde | Cómo |
| --- | --- | --- | --- |
| 1 | Entrada del detalle | `DetailScreen` | `Animated.parallel`: opacidad 0 → 1 y `translateY` 30 → 0 en 500 ms |
| 2 | Feedback táctil | `AnimatedCard` (tarjetas del catálogo) | `Animated.spring`: escala 1 → 0.95 al presionar y vuelta a 1 con rebote |
| 3 | Barra de progreso | `ProgressBar` | `interpolate` de ancho `0% → 100%` y de color rojo → amarillo → verde |
| 4 | Entrada en cascada | `HomeScreen` | `Animated.stagger(80, …)`: cada espacio aparece con 80 ms de retraso |
| 5 | Cambio de layout | `HomeScreen` y `SavedScreen` | `LayoutAnimation.configureNext(easeInEaseOut)` antes de agregar o quitar |

Además:

- **`AnimatedButton`:** comprime con `Animated.timing` (80 ms) al presionar y
  vuelve con `Animated.spring`; se usa en “Ver más espacios”, guardar, renovar
  sesión, cerrar sesión y los reintentos.
- **`src/utils/layoutAnimation.ts`:** activa
  `UIManager.setLayoutAnimationEnabledExperimental?.(true)` en Android **a nivel
  de módulo** (fuera del componente, como pide el bootcamp) y expone
  `animateNextLayout()` para llamarlo justo antes del cambio de estado.
- **Barra de progreso con datos del dominio:** en el catálogo mide la
  **ocupación del edificio** (espacios libres sobre el total) y en el detalle la
  **ocupación del piso** de ese espacio, calculada con el catálogo que ya está en
  caché de TanStack Query.
- **Paginación animada:** el catálogo respeta la preferencia de espacios por
  página y el botón **Ver más espacios** añade el siguiente bloque con
  `LayoutAnimation`; los espacios nuevos entran en cascada (`stagger`) y los que
  ya estaban no se vuelven a animar.
- **`ItemCard` pasó a ser presentacional:** ya no lleva su propio `Pressable`,
  así el toque y la animación de escala los aporta `AnimatedCard` sin dobles
  respuestas al tacto.

## Cómo se respetó el driver nativo

`useNativeDriver: true` en todo lo que es opacidad y transformación (entradas,
escala, desplazamientos) y `useNativeDriver: false` **solo** en la barra de
progreso, porque anima `width` y `backgroundColor`, que no pueden ir por el hilo
nativo. No hay ningún aviso de driver mal puesto.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 1167 módulos |
| Comportamientos exigidos presentes | 5 de 5 (`parallel`, `spring`, `interpolate`, `stagger`, `LayoutAnimation`) |
| `useNativeDriver` | `true` en opacidad y transformaciones; `false` solo en ancho y color |
| Importaciones fuera de `package.json` | 0 |

## Estructura de esta semana

```
semana-09/  (raíz del repositorio)
├── App.tsx                        QueryClient + hidratación + restoreSession
├── index.js                       Registro del componente raíz
├── app.json                       Configuración (incluye scheme para OAuth)
├── package.json                   Dependencias
└── src/
    ├── components/
    │   ├── AnimatedCard.tsx       Feedback de tap con spring
    │   ├── AnimatedButton.tsx     timing al presionar + spring al soltar
    │   ├── ProgressBar.tsx        Ancho y color interpolados
    │   ├── FormField.tsx          Controller + TextInput + error
    │   ├── GithubSignInButton.tsx Flujo OAuth PKCE
    │   └── ItemCard.tsx           Tarjeta presentacional
    ├── hooks/
    │   ├── usePreferences.ts      Preferencias MMKV reactivas
    │   └── useSpaces.ts           useQuery con caché offline
    ├── navigation/
    │   ├── RootNavigator.tsx      Condicional: Auth o App + espera de sesión
    │   ├── AuthNavigator.tsx      Stack Login · Crear cuenta
    │   ├── AppNavigator.tsx       Tab protegido + Stack del catálogo
    │   └── types.ts               Listas de params tipadas
    ├── schemas/
    │   ├── authSchema.ts          loginSchema y registerSchema
    │   └── spaceSchema.ts         Reglas Zod de los espacios
    ├── screens/
    │   ├── HomeScreen.tsx         Cascada, layout animado y ocupación
    │   ├── DetailScreen.tsx       Entrada con parallel y ocupación del piso
    │   ├── SavedScreen.tsx        Quitar guardados con animación de layout
    │   ├── LoginScreen.tsx        RHF + Zod + OAuth
    │   ├── RegisterScreen.tsx     Registro validado
    │   ├── ProfileScreen.tsx      Cuenta + horas del plan animadas
    │   ├── CreateScreen.tsx       Creación validada
    │   ├── EditScreen.tsx         Edición con reset()
    │   └── SettingsScreen.tsx     Preferencias + Sesión + SecureStore
    ├── services/                  api · authService · oauthService · tokenService
    ├── storage/mmkv.ts            MMKV con respaldo y suscripciones
    ├── stores/                    authStore · savedStore
    ├── theme/index.ts             COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts             Modelos del dominio + tipos de auth
    └── utils/
        ├── format.ts              Precios COP, capacidad, horas y hora
        ├── layoutAnimation.ts     Flag de Android + animación de layout
        ├── memberMapper.ts        Usuario de la API → miembro del dominio
        ├── spaceCache.ts          Serialización de la caché
        ├── spaceMapper.ts         API → dominio
        └── sortSpaces.ts          Los tres órdenes del catálogo
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-09
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

Entra con `emilys` / `emilyspass`. Qué mirar: la cascada de las tarjetas al abrir
el catálogo, el encogido de la tarjeta al mantenerla presionada, la entrada del
detalle al tocar un espacio, la barra de ocupación al cambiar de piso y el
reacomodo animado de la lista al tocar **Ver más espacios** o al quitar un
guardado.

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

La sesión también funciona en web: los tokens usan esa misma capa y el cierre de
sesión se confirma con el diálogo propio de la app (`ConfirmDialog`), que se ve
igual en el navegador que en el móvil.

Las animaciones se ven en web; el feedback táctil usa `useNativeDriver: false` en
el navegador (no existe el driver nativo) y `LayoutAnimation` se omite ahí, porque
la API no está implementada.


## Capturas de esta semana

| Archivo | Pantalla | Cómo llegar |
| --- | --- | --- |
| `09-cascada.png` | Entrada en cascada del catálogo | Abrir la app: las tarjetas llegan con 80 ms de retraso |
| `09-detalle.png` | Entrada del detalle y ocupación del piso | Tocar *Sala de Juntas · Aurora* |
| `09-ocupacion.png` | Barra de ocupación del edificio | Pantalla del catálogo, bajo el buscador |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-09`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 09 — Animaciones Básicas`
