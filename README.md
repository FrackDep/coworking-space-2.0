# Semana 03 — React Navigation 7

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-03`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-02` y le suma lo de esta semana, así que la historia de la rama son
los 3 commits de las semanas 01 a 03.

## Qué pide el bootcamp

1. App funcional en simulador iOS y/o Android con navegación Tab + Stack
2. Código TypeScript sin errores, sin `any`, tipos de params correctos
3. Datos y pantallas adaptados al dominio asignado
4. Capturas de pantalla de las 3 pantallas (Home, Detail, Favorites)
5. README actualizado con descripción breve del dominio y la implementación

**Criterios de la rúbrica:** params tipados con al menos `id` y `name`, íconos
Ionicons en la tab bar y `tabBarActiveTintColor: '#61DAFB'`.

## Qué implementé

- **Tab Navigator con dos pestañas** (*Espacios* y *Guardados*) y un **Stack
  anidado** dentro de la primera: `HomeList` → `HomeDetail`.
- **Params tipados de verdad:** `RootTabParamList` y `HomeStackParamList` en
  `src/navigation/types.ts`, sin ningún `any` en el proyecto.
- **Tab bar con íconos de línea** de Ionicons (`business-outline` y
  `bookmark-outline`), con el acento `#61DAFB` del tema para la pestaña activa.
- **`DetailScreen`** que recibe `id` y `name` por params, busca el espacio y
  muestra la ficha completa: imagen, tipo, disponibilidad, piso, capacidad y
  precio por hora. Incluye el caso borde de un id que no existe.
- **`FavoritesScreen`** con favoritos de ejemplo y su estado vacío, listos para
  conectarse al estado global de la semana 04.
- Header descriptivo por pantalla: el título del detalle es el nombre del espacio.

## Estructura de esta semana

```
semana-03/  (raíz del repositorio)
├── App.tsx                          NavigationContainer + SafeAreaProvider
├── index.js                         Registro del componente raíz
├── app.json                         Configuración de Expo
├── package.json                     Dependencias de la semana
└── src/
    ├── components/ItemCard.tsx      Tarjeta que navega al detalle
    ├── data/mockData.ts             12 espacios del edificio
    ├── navigation/
    │   ├── RootNavigator.tsx        Tab + Stack anidado
    │   └── types.ts                 Listas de params tipadas
    ├── screens/
    │   ├── HomeScreen.tsx           Catálogo con búsqueda
    │   ├── DetailScreen.tsx         Ficha del espacio (params tipados)
    │   └── FavoritesScreen.tsx      Favoritos de ejemplo
    ├── theme/index.ts               COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts               Modelo Space y tipos de espacio
    └── utils/format.ts              Formato de precios COP y capacidad
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-03
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores (sin `any`) |
| `expo export --platform android` | 922 módulos |

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
| `03-detalle.png` | Detalle de un espacio | Tocar la tarjeta *Sala de Juntas · Aurora* |
| `03-guardados.png` | Pestaña de favoritos | Tocar la pestaña *Guardados* |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-03`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 03 — React Navigation 7`
