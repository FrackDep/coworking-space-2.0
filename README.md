# Semana 08 — Autenticación Completa

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-08`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-07` y le suma lo de esta semana, así que la historia de la rama son
los 8 commits de las semanas 01 a 08.

## Qué pide el bootcamp

1. **`useAuthStore`:** store de Zustand con `user`, `isAuthenticated`, `login()`,
   `logout()` y `refreshTokens()`
2. **`LoginScreen`:** formulario con React Hook Form + Zod que llama al store y
   maneja el error de credenciales
3. **`RegisterScreen`:** formulario con usuario, correo, contraseña y confirmación
4. **Navegación condicional:** stack de autenticación cuando no hay sesión y
   stack protegido cuando sí la hay, sin re-render visible
5. **Tokens en SecureStore:** nunca en AsyncStorage ni en MMKV sin cifrar
6. **Interceptor de Axios:** detectar el 401, renovar el token y reintentar la
   petición original
7. **`ProfileScreen`:** datos del usuario autenticado, coherentes con el dominio

Los dos ejercicios del bootcamp (JWT con dummyjson y OAuth PKCE con Expo
AuthSession) se integran dentro de la app: el de JWT es el propio login, y el de
OAuth es el botón **Continuar con GitHub** del login.

## Qué implementé

- **`src/stores/authStore.ts`:** store de Zustand con `persist` y `partialize`
  (solo se persisten `user` e `isAuthenticated`; los tokens viven aparte, en
  SecureStore). Acciones: `login`, `register`, `signInWithOAuth`, `logout`,
  `refreshTokens`, `restoreSession` y `clearError`.
- **`src/services/tokenService.ts`:** envoltorio de SecureStore con
  `saveTokens`, `getAccessToken`, `getRefreshToken`, `clearTokens`, más la
  lectura del JWT (`readTokenExpiry`, `readTokenClaims`) con `jwt-decode`.
- **`src/services/authService.ts`:** `login` contra
  `POST https://dummyjson.com/auth/login` (con `expiresInMins: 30`), `register`
  simulado, `refreshTokens` contra `POST /auth/refresh` y `getProfile` contra
  `GET /auth/me`.
- **`src/services/api.ts`:** interceptor de petición que inyecta
  `Authorization: Bearer <token>` y interceptor de respuesta que ante un **401**
  pide tokens nuevos, actualiza el encabezado y **reintenta la petición
  original** una sola vez (bandera `retried`). Si no hay forma de renovar, cierra
  la sesión.
- **Navegación condicional:** `RootNavigator` muestra `AuthNavigator`
  (Login · Crear cuenta) o `AppNavigator` (Espacios · Guardados · Mi cuenta ·
  Ajustes) según `isAuthenticated`, con una pantalla de espera mientras se
  restaura la sesión.
- **`restoreSession()`:** al abrir la app se leen los tokens de SecureStore; si
  el access token sigue vigente se entra directo, y si ya expiró se renueva con
  el refresh token (o se cierra la sesión si tampoco sirve).
- **`ProfileScreen` (dominio):** avatar con iniciales (o la foto real si la
  sesión es de GitHub), plan de membresía, año de alta, piso preferido, horas
  consumidas del plan, espacios guardados, datos que llegan del servidor con
  `GET /auth/me`, el estado del token con la hora de vencimiento y los botones
  **Renovar sesión** y **Cerrar sesión**.
- **`SettingsScreen`:** se conserva todo lo de la semana 07 (preferencias y
  código de acceso) y se añade la sección **Sesión**, que recuerda que los
  tokens van a SecureStore y permite cerrar sesión desde ahí.

## Notas técnicas de la semana

**Registro simulado.** dummyjson.com no tiene endpoint de registro, así que
`register()` crea la cuenta en el dispositivo con una sesión de demostración
(tokens con el prefijo `demo-`) después de validar el formulario. El ingreso con
usuario y contraseña sí se valida contra la API real: las credenciales de prueba
son `emilys` / `emilyspass`, y la pantalla de login tiene un botón que las
rellena.

**Renovación sin red.** Cuando el refresh token es de demostración, la renovación
se resuelve en el dispositivo en vez de llamar a `/auth/refresh`, para que la
sesión de prueba no se caiga sola. Con una sesión real, la renovación sí va a la
API.

**OAuth PKCE (ejercicio 02).** En `src/services/oauthService.ts` está configurado
el flujo completo con `expo-auth-session` y PKCE: `makeRedirectUri` con el esquema
`coworking-space` (declarado en `app.json`), `usePKCE: true`, canje del
`code` + `code_verifier` por un token y lectura del perfil de GitHub. Para que
funcione de verdad hay que: crear una OAuth App en GitHub, copiar su Client ID en
`EXPO_PUBLIC_GITHUB_CLIENT_ID`, registrar la URL de redirección que genera
`makeRedirectUri()` y correr **un build nativo** (`pnpm expo run:android`), porque
en Expo Go el esquema propio de la app no se puede usar. Sin configurar, el botón
explica exactamente qué falta en vez de fallar en silencio.

**Sin `any`.** El interceptor usa una configuración de Axios extendida
(`retried?: boolean`) y los datos del servidor se validan con tipos explícitos.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 1163 módulos |
| Comprobaciones de lógica en Node | 27 correctas, 0 fallas |
| Importaciones fuera de `package.json` | 0 |

Las 27 comprobaciones cubren: validación Zod del login y del registro (8 casos),
guardado/lectura/borrado de tokens en SecureStore (6), lectura del `exp` de un JWT
real y de un token de demostración (2), el mapeo del perfil de dominio (7), la
renovación sin red, el registro simulado y los cuatro caminos de
`restoreSession` (4).

## Estructura de esta semana

```
semana-08/  (raíz del repositorio)
├── App.tsx                        QueryClient + hidratación + restoreSession
├── index.js                       Registro del componente raíz
├── app.json                       Configuración (incluye scheme para OAuth)
├── package.json                   Dependencias (auth-session, crypto, jwt-decode)
└── src/
    ├── components/
    │   ├── FormField.tsx          Controller + TextInput + error
    │   ├── GithubSignInButton.tsx Flujo OAuth PKCE (o aviso de configuración)
    │   └── ItemCard.tsx           Tarjeta con modo compacto
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
    │   ├── LoginScreen.tsx        RHF + Zod + OAuth + credenciales de prueba
    │   ├── RegisterScreen.tsx     Registro validado
    │   ├── ProfileScreen.tsx      Cuenta del miembro y sesión
    │   ├── HomeScreen.tsx         Catálogo con caché offline
    │   ├── DetailScreen.tsx       Detalle del espacio
    │   ├── CreateScreen.tsx       Creación validada
    │   ├── EditScreen.tsx         Edición con reset()
    │   ├── SavedScreen.tsx        Guardados (Zustand)
    │   └── SettingsScreen.tsx     Preferencias + Sesión + SecureStore
    ├── services/
    │   ├── api.ts                 Axios + interceptores de auth
    │   ├── authService.ts         login · register · refresh · me
    │   ├── oauthService.ts        OAuth PKCE con GitHub
    │   └── tokenService.ts        SecureStore + lectura del JWT
    ├── storage/mmkv.ts            MMKV con respaldo y suscripciones
    ├── stores/
    │   ├── authStore.ts           Sesión global (Zustand + SecureStore)
    │   └── savedStore.ts          Guardados (Zustand)
    ├── theme/index.ts             COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts             Modelos del dominio + tipos de auth
    └── utils/
        ├── format.ts              Precios COP, capacidad, horas y hora
        ├── memberMapper.ts        Usuario de la API → miembro del dominio
        ├── spaceCache.ts          Serialización de la caché
        ├── spaceMapper.ts         API → dominio
        └── sortSpaces.ts          Los tres órdenes del catálogo
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-08
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

Al abrir: pantalla de login. Entra con `emilys` / `emilyspass` (o toca el botón
de credenciales de prueba), y llegarás al catálogo con la pestaña *Mi cuenta* ya
disponible. El botón de cerrar sesión está en *Mi cuenta* y en *Ajustes*.

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


## Capturas de esta semana

| Archivo | Pantalla | Cómo llegar |
| --- | --- | --- |
| `08-login.png` | Ingreso de miembro | Abrir la app sin sesión |
| `08-registro.png` | Errores de validación del registro | *Crear cuenta* → tocar el botón con el formulario vacío |
| `08-perfil.png` | Cuenta, plan y sesión | Entrar → pestaña *Mi cuenta* |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-08`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 08 — Autenticación Completa`
