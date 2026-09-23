<h1 align="center">Nido Coworking</h1>

<p align="center">
  <strong>Entregas del bootcamp React Native Zero to Hero — semanas 01 a 09</strong><br>
  <sub>Dominio asignado: <em>coworking space</em> · Expo SDK 57 · React Native 0.86 · TypeScript 6.0</sub>
</p>

**Nido Coworking** es la app de un edificio de coworking de 5 pisos en Bogotá:
6 tipos de espacio (escritorio flexible, escritorio dedicado, sala de juntas,
oficina privada, cabina fónica y sala de eventos), con precios por hora en pesos
colombianos.

Esta es la **portada del repositorio**. Aquí no hay código: cada semana del
bootcamp vive en **su propia rama**, como una entrega independiente.

## <img src="assets/icons/git-branch.svg" width="20" height="20" alt=""> Cómo está organizado el repositorio

- **`main`** — esta portada: solo este README y los íconos que usa.
- **`semana-01` … `semana-09`** — nueve ramas **encadenadas**: cada una parte de
  la anterior y le añade lo de su semana. El proyecto queda en la **raíz** de la
  rama (sin subcarpetas por semana), así que al abrir una rama ya tienes la app
  de esa entrega lista para instalar.

```
main       ●                     Portada (solo este README)

semana-01  ●                     Semana 01 — Core Components y Flexbox
semana-02  ●─●                   Semana 02 — Listas, Inputs y Estilos
semana-03  ●─●─●                 Semana 03 — React Navigation 7
semana-04  ●─●─●─●               Semana 04 — Estado Global con Zustand
semana-05  ●─●─●─●─●             Semana 05 — Networking y TanStack Query
semana-06  ●─●─●─●─●─●           Semana 06 — Formularios con React Hook Form + Zod
semana-07  ●─●─●─●─●─●─●         Semana 07 — Persistencia Local
semana-08  ●─●─●─●─●─●─●─●       Semana 08 — Autenticación Completa
semana-09  ●─●─●─●─●─●─●─●─●     Semana 09 — Animaciones Básicas (app completa)
```

Cada `●` es un commit: **uno por semana**. La rama `semana-0N` contiene los `N`
commits de las semanas 01 a 0N, así que se ve por separado qué aportó cada
semana (`git show` en ese commit) y a la vez el progreso completo hasta ahí.

| Rama | Carpeta del bootcamp | Qué añade esa semana | Bundle Android |
| :--- | :--- | :--- | :---: |
| `semana-01` | `week-01-core_components_y_flexbox` | Proyecto base + dominio definido + pantalla única con 4 tarjetas | 586 módulos |
| `semana-02` | `week-02-listas_inputs_y_estilos` | Catálogo de 12 espacios, buscador en tiempo real y sistema de tema | 591 módulos |
| `semana-03` | `week-03-react_navigation` | Navegación Tab + Stack, detalle y favoritos, params tipados | 922 módulos |
| `semana-04` | `week-04-estado_global_zustand` | Store de Zustand, badge en tiempo real y pantalla de guardados | 926 módulos |
| `semana-05` | `week-05-networking_tanstack_query` | Catálogo desde la API (Axios + TanStack Query) y estados de red | 982 módulos |
| `semana-06` | `week-06-formularios_validacion` | Create y Edit con React Hook Form + Zod y `FormField` reutilizable | 1068 módulos |
| `semana-07` | `week-07-persistencia_local` | Preferencias en MMKV, caché offline y SecureStore | 1116 módulos |
| `semana-08` | `week-08-autenticacion` | Autenticación completa: sesión en SecureStore, navegación condicional e interceptor 401 | 1163 módulos |
| `semana-09` | `week-09-animaciones_basicas` | Animaciones: cascada, feedback táctil, barras de ocupación y `LayoutAnimation` | 1167 módulos |

## <img src="assets/icons/terminal.svg" width="20" height="20" alt=""> Cómo ejecutar cualquier semana

```bash
git clone https://github.com/TU-USUARIO/coworking-space.git
cd coworking-space
git branch -a            # las 9 ramas + main
git checkout semana-03   # la semana que quieras ver
pnpm install             # cada rama tiene sus dependencias
pnpm start               # QR de Expo Go

pnpm web                 # o ábrela en el navegador (sin emulador ni teléfono)
```

- Cambia `semana-03` por la rama que quieras (`semana-01` … `semana-09`).
- Al cambiar de rama, **vuelve a ejecutar `pnpm install`**: las semanas
  posteriores traen dependencias nuevas.
- Si `git checkout semana-03` dice que no existe, usa
  `git checkout -t origin/semana-03` (la primera vez que bajas esa rama).
- La rama `semana-09` es la app completa; las anteriores muestran la app en el
  punto exacto de esa semana.
- `pnpm web` abre la app en `http://localhost:8081` en el navegador del PC. Sirve
  para revisar o capturar pantallas sin teléfono (si el navegador bloquea su
  almacenamiento, la app funciona igual con memoria temporal). Para dejar la versión estática:
  `pnpm exec expo export --platform web` (queda en `dist-web/`).

Desde la semana 05 el catálogo se carga por internet (API de JSONPlaceholder) y
desde la 07 funciona sin red con la caché. Desde la 08 hay login: usa
`emilys` / `emilyspass` (la pantalla tiene un botón que rellena esas
credenciales de prueba).

## <img src="assets/icons/badge-check.svg" width="20" height="20" alt=""> Verificación de cada entrega

Cada rama se comprobó por separado, en una carpeta limpia: instalación,
compilación de TypeScript y empaquetado del bundle de Android.

| Rama | `tsc --noEmit` | Bundle Android | Bundle web | Comprobaciones extra |
| :--- | :---: | :---: | :---: | :--- |
| `semana-01` | 0 errores | 586 módulos | 183 módulos | — |
| `semana-02` | 0 errores | 591 módulos | 240 módulos | Buscador y estado vacío |
| `semana-03` | 0 errores | 922 módulos | 603 módulos | Sin ningún `any` |
| `semana-04` | 0 errores | 926 módulos | 607 módulos | 10 comprobaciones del store en Node, 0 fallas |
| `semana-05` | 0 errores | 982 módulos | 710 módulos | Mapeo API → dominio contra la API real |
| `semana-06` | 0 errores | 1068 módulos | 797 módulos | 15 casos de validación Zod |
| `semana-07` | 0 errores | 1118 módulos | 814 módulos | Órdenes y caché probados en Node |
| `semana-08` | 0 errores | 1167 módulos | 874 módulos | 27 comprobaciones en Node, 0 fallas |
| `semana-09` | 0 errores | 1171 módulos | 880 módulos | Los 5 comportamientos y `useNativeDriver` correcto |

El bundle crece semana a semana porque cada entrega suma dependencias y
pantallas. Todas las ramas llevan el código sin comentarios y sin ningún `any`.
La columna **Bundle web** es el bundle de navegador de esa misma rama
(`expo export --platform web`), que se probó cargando la app en un navegador real.

## <img src="assets/icons/camera.svg" width="20" height="20" alt=""> Capturas de pantalla

Cada rama tiene su propia carpeta `capturas/` con las capturas de esa entrega:

| Rama | Archivos |
| :--- | :--- |
| `semana-01` | `01-home-tarjetas.png` |
| `semana-02` | `02-busqueda.png`, `02-estado-vacio.png` |
| `semana-03` | `03-detalle.png`, `03-guardados.png` |
| `semana-04` | `04-badge.png` |
| `semana-05` | `05-crear.png`, `05-error.png` |
| `semana-06` | `06-validacion.png`, `06-editar.png` |
| `semana-07` | `07-ajustes.png`, `07-offline.png` |
| `semana-08` | `08-login.png`, `08-registro.png`, `08-perfil.png` |
| `semana-09` | `09-cascada.png`, `09-detalle.png`, `09-ocupacion.png` |

El README de cada rama explica a qué pantalla corresponde cada una y cómo
llegar.

## <img src="assets/icons/calendar-week.svg" width="20" height="20" alt=""> Historial de commits

Un commit por semana, en orden, cada uno sobre el anterior:

```
Semana 01 — Core Components y Flexbox
Semana 02 — Listas, Inputs y Estilos
Semana 03 — React Navigation 7
Semana 04 — Estado Global con Zustand
Semana 05 — Networking y TanStack Query
Semana 06 — Formularios con React Hook Form + Zod
Semana 07 — Persistencia Local
Semana 08 — Autenticación Completa
Semana 09 — Animaciones Básicas
```

Cada mensaje lleva su cuerpo con `For:` (qué pide el bootcamp esa semana) e
`Impact:` (qué queda hecho), para que la entrega se entienda sin abrir el código.

## <img src="assets/icons/pen.svg" width="20" height="20" alt=""> Notas de configuración

Los starters del bootcamp traen varias cosas resueltas aquí, iguales en todas las
ramas:

1. **Entry point roto.** Usan `"main": "expo/AppEntry"` (y en la semana 04,
   `expo-router/entry`), que ya no existen en Expo SDK 57: la app queda en
   pantalla blanca. Aquí se usa `index.js` + `registerRootComponent`.
2. **`app.json` obsoleto.** Declaran `"sdkVersion": "53.0.0"` y apuntan a
   `icon`/`splash`/`adaptiveIcon` que no existen. Aquí se omiten.
3. **`StatusBar` con `backgroundColor`.** El starter de la semana 02 usa una prop
   que ya no existe en SDK 57 y rompe la compilación. Aquí se omite.
4. **Resolver de formularios.** El starter de la semana 06 combina
   `@hookform/resolvers@5.4.0` con `zod@4.4.3`, que no son compatibles a nivel de
   tipos. Aquí se usa `@hookform/resolvers@5.9.1`.
5. **Autenticación (semana 08).** La API pública de práctica (dummyjson.com) no
   tiene endpoint de registro, así que el registro se resuelve en el dispositivo
   con una sesión de demostración, y el login sí se valida contra la API real. El
   OAuth con GitHub requiere un Client ID propio y un build nativo (en Expo Go no
   se puede usar el esquema propio de la app); sin configurar, el botón explica
   qué falta.
6. **MMKV (semana 07).** `react-native-mmkv` es un módulo JSI/Nitro que **no
   existe en Expo Go**. El proyecto detecta el caso y usa AsyncStorage como
   respaldo con la misma API; la pantalla *Ajustes* indica cuál está activo.
7. **Driver nativo (semana 09).** Las animaciones de opacidad y transformación
   usan `useNativeDriver: true`; solo la barra de progreso usa `false`, porque
   anima `width` y `backgroundColor`. En web se usa `false`, porque el driver
   nativo no existe en el navegador.
8. **Web (todas las ramas).** Cada entrega se abre también en el navegador con
   `pnpm web`, sin emulador ni teléfono. Como el navegador no tiene los módulos
   nativos, el proyecto resuelve los tres casos: los datos sensibles pasan por
   `src/storage/secureStore.ts` (llavero del dispositivo en el móvil,
   localStorage en web), el cierre de sesión se confirma con el diálogo propio
   `src/components/ConfirmDialog.tsx` (el `Alert` nativo no existe en web) y en
   web se omite `LayoutAnimation`, que no está implementada ahí.
9. **Almacenamiento tolerante (semanas 07-09).** `src/storage/safeStorage.ts`
   envuelve AsyncStorage: si el navegador bloquea el almacenamiento (por ejemplo
   dentro de un iframe con `sandbox`, donde `localStorage` lanza `SecurityError`),
   las llamadas fallan de forma controlada y la app sigue funcionando con memoria
   temporal durante la sesión, en lugar de quedarse cargando.

## <img src="assets/icons/target.svg" width="20" height="20" alt=""> Requisitos

- Node 22 o superior
- pnpm 10.28.0 (`npm install -g pnpm@10.28.0`)
- Expo Go en el teléfono, o un emulador de Android / simulador de iOS
