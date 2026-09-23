# Semana 01 — Core Components y Flexbox

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-01`**: el punto de partida del proyecto, con el
código en la **raíz** del repositorio (sin subcarpetas por semana).

## Qué pide el bootcamp

1. App funcional en simulador iOS y/o Android
2. Mínimo 3 tarjetas con datos del dominio
3. Código subido al repositorio con el nombre del dominio en el `app.json`
4. Screenshot o grabación de la app

**Restricciones de la semana:** nada de `position: 'absolute'` (solo Flexbox),
ninguna librería de UI externa y ningún `style={{ ... }}` en el JSX.

## Qué implementé

- **Proyecto base** con Expo SDK 57, React Native 0.86 y TypeScript estricto, con
  el entry point corregido (`index.js` + `registerRootComponent`). Los starters
  del bootcamp traen `"main": "expo/AppEntry"` y `"sdkVersion": "53.0.0"`, que en
  el SDK 57 dejan la app en pantalla blanca.
- **Dominio definido:** 6 tipos de espacio (escritorio flexible, escritorio
  dedicado, sala de juntas, oficina privada, cabina fónica y sala de eventos) con
  precios por hora en pesos colombianos.
- **Modelo tipado** `Space` (id, nombre, tipo, descripción, piso, capacidad,
  precio por hora, disponibilidad e imagen) y 4 espacios de ejemplo con fotos
  locales en `assets/spaces/`.
- **`HomeScreen`** con header del dominio y el listado de tarjetas dentro de un
  `ScrollView`.
- **`ItemCard`** por tarjeta: imagen, dos textos con estilos distintos (nombre y
  descripción) y una acción `Pressable` con feedback visual al pulsar.
- Todo el estilado con `StyleSheet.create` y Flexbox: sin `position: 'absolute'`,
  sin librerías de UI y sin estilos inline, como pide la semana.
- `app.json` con `"name": "coworking-space"`.

## Estructura de esta semana

```
semana-01/  (raíz del repositorio)
├── App.tsx                      Componente raíz
├── index.js                     Registro del componente raíz
├── app.json                     Configuración de Expo (nombre del dominio)
├── package.json                 Dependencias de la semana
├── pnpm-lock.yaml               Versiones fijadas
├── tsconfig.json                TypeScript estricto
├── expo-env.d.ts                Tipos del entorno Expo/Metro
├── assets/spaces/               Fotos locales de los 6 tipos de espacio
└── src/
    ├── components/ItemCard.tsx  Tarjeta del espacio
    ├── data/mockData.ts         Cuatro espacios de ejemplo
    ├── screens/HomeScreen.tsx   Pantalla única con el catálogo
    ├── types/index.ts           Modelo Space y tipos de espacio
    └── utils/format.ts          Formato de precios COP y capacidad
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-01
pnpm install
pnpm start
```

Las 9 ramas están encadenadas: `semana-01` es la base y `semana-09` es la app
completa. Al cambiar de rama, vuelve a ejecutar `pnpm install`, porque cada
semana puede traer dependencias nuevas.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 586 módulos |

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
| `01-home-tarjetas.png` | Catálogo con las tarjetas | Abrir la app |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-01`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 01 — Core Components y Flexbox`
