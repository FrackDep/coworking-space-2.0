# Semana 04 — Estado Global con Zustand

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-04`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-03` y le suma lo de esta semana, así que la historia de la rama son
los 4 commits de las semanas 01 a 04.

## Qué pide el bootcamp

1. App con Tab + Stack funcional y estado Zustand compartido entre pestañas
2. Badge en el tab bar actualizado en tiempo real
3. TypeScript sin errores, sin `any`
4. Código y datos adaptados al dominio asignado
5. Capturas de pantalla de Home, Detail y Saved screens

**Criterios de la rúbrica:** `create<Interface>()` sin `any`, selectores
específicos en cada componente y nada de `useState` para el estado compartido.

## Qué implementé

- **`savedStore` con Zustand** (`create<SavedStore>()`): `items`, `addItem` que
  no duplica el mismo id, `removeItem(id)`, `clearAll()` e `isItemSaved(id)`.
- **Badge en el tab bar en tiempo real:** el contador de *Guardados* se lee del
  store, así que sube y baja al instante desde cualquier pantalla, sin pasar
  props ni usar `useState`.
- **Botón Guardar / Quitar en el detalle**, conectado al mismo store, con ícono
  de línea (`bookmark-outline`) en ambos estados.
- **`SavedScreen`** (pestaña *Guardados*) con el listado real del store, quitado
  uno a uno, botón *Limpiar todo* y su estado vacío.
- **Selectores específicos:** cada componente se suscribe solo a lo que necesita
  (`items`, `items.length`, `isItemSaved`, las acciones), no al store completo.
- Se eliminan los favoritos estáticos de la semana 03: ahora todo pasa por el store.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores (sin `any`) |
| `expo export --platform android` | 926 módulos |
| Lógica del store ejecutada en Node | 10 comprobaciones, 0 fallas |

Las comprobaciones del store fueron: arranca vacío, `addItem` agrega, `addItem`
no duplica el mismo id, `isItemSaved` responde bien en ambos casos, `removeItem`
quita por id, no borra otros items, `clearAll` vacía la lista y el conteo que lee
el badge es el correcto.

## Estructura de esta semana

```
semana-04/  (raíz del repositorio)
├── App.tsx                        NavigationContainer + SafeAreaProvider
├── index.js                       Registro del componente raíz
├── app.json                       Configuración de Expo
├── package.json                   Dependencias de la semana (incluye Zustand)
└── src/
    ├── components/ItemCard.tsx    Tarjeta que navega al detalle
    ├── data/mockData.ts           12 espacios del edificio
    ├── navigation/
    │   ├── RootNavigator.tsx      Tab (con badge) + Stack anidado
    │   └── types.ts               Listas de params tipadas
    ├── screens/
    │   ├── HomeScreen.tsx         Catálogo con búsqueda
    │   ├── DetailScreen.tsx       Detalle + botón Guardar/Quitar
    │   └── SavedScreen.tsx        Guardados: quitar uno o limpiar todo
    ├── stores/savedStore.ts       Estado global (Zustand)
    ├── theme/index.ts             COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts             Modelo Space y tipos de espacio
    └── utils/format.ts            Formato de precios COP y capacidad
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-04
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

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
| `04-badge.png` | Badge en el tab bar | Guardar 3 espacios y volver al catálogo |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-04`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 04 — Estado Global con Zustand`
