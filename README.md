# Semana 06 — Formularios con React Hook Form + Zod

Proyecto del dominio **coworking space**: **Nido Coworking**, la app de un edificio
de coworking de 5 pisos en Bogotá, con 6 tipos de espacio y precios en COP.

Esta es la rama **`semana-06`**: contiene el proyecto completo hasta esta
semana, con el código en la **raíz** del repositorio. Parte de lo que dejó
`semana-05` y le suma lo de esta semana, así que la historia de la rama son
los 6 commits de las semanas 01 a 06.

## Qué pide el bootcamp

1. **`FormField` genérico:** un componente que encapsule `Controller` +
   `TextInput` + mensaje de error, reutilizado en Create y Edit
2. **`CreateScreen`:** formulario con al menos 2 campos, validación Zod y la
   mutación de TanStack Query, con navegación atrás en `onSuccess`
3. **`EditScreen`:** el mismo formulario con `defaultValues` cargados del
   servidor y `reset()` cuando llegan los datos
4. **Validación activa:** errores visibles bajo cada campo al intentar enviar
5. **Estado de carga:** botón deshabilitado y spinner durante el envío

## Qué implementé

- **`src/schemas/spaceSchema.ts`:** esquema Zod con las reglas del dominio y el
  tipo inferido con `z.infer`, sin ninguna interfaz duplicada.

  | Campo | Regla |
  | --- | --- |
  | `name` | texto de 3 a 80 caracteres |
  | `description` | texto de 10 a 500 caracteres |
  | `type` | uno de los 6 tipos de espacio del edificio |
  | `floor` | entero de 1 a 10 (`z.coerce.number()`) |
  | `capacity` | entero de 1 a 40 personas |
  | `pricePerHour` | mayor que 0 y máximo $ 500.000 COP |

- **`FormField` genérico** (`src/components/FormField.tsx`): encapsula
  `Controller` + `TextInput` + el mensaje de error, tipado con los genéricos de
  React Hook Form (`Control`, `FieldPath`) y reutilizado en las dos pantallas.
- **`CreateScreen`** validado con `zodResolver`: solo publica si el formulario es
  válido y vuelve atrás cuando la mutación termina bien.
- **`EditScreen`** con `defaultValues` del espacio que llega del servidor,
  `reset()` cuando los datos están listos y `isDirty` para habilitar el botón
  únicamente si hay cambios. Se llega desde el botón de lápiz del header del
  detalle.
- **`useUpdateSpace`** con `invalidateQueries` de la lista y del detalle.
- Spinner (`ActivityIndicator`) y botón deshabilitado mientras `isPending`.

## Nota técnica: la versión del resolver

El starter de esta semana trae `@hookform/resolvers@5.4.0` junto a `zod@4.4.3`, y
**esas dos versiones no son compatibles a nivel de tipos**: el resolver espera la
verificación de Zod de la versión 3 y TypeScript rechaza el `useForm` completo.
Aquí se usa `@hookform/resolvers@5.9.1`, que sí soporta Zod 4, y el `useForm` se
tipa con `z.input` y `z.output` (`useForm<SpaceFormInput, unknown, SpaceFormData>`)
porque los campos con `z.coerce` entran como texto y salen como número.

## Verificación

| Comprobación | Resultado |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 errores |
| `expo export --platform android` | 1068 módulos |
| Casos de validación ejecutados contra el esquema compilado | 15 casos: 2 válidos aceptados y 13 inválidos rechazados con su mensaje |

Los casos inválidos cubiertos fueron: nombre corto, descripción corta, piso 0,
piso 11, piso vacío, piso no numérico, capacidad 0, capacidad 41, precio 0,
precio negativo, precio por encima del máximo, tipo inexistente y tipo ausente.

## Estructura de esta semana

```
semana-06/  (raíz del repositorio)
├── App.tsx                        QueryClientProvider + NavigationContainer
├── index.js                       Registro del componente raíz
├── app.json                       Configuración de Expo
├── package.json                   Dependencias (RHF + Zod + resolvers)
└── src/
    ├── components/
    │   ├── FormField.tsx          Controller + TextInput + error (reutilizable)
    │   └── ItemCard.tsx           Tarjeta que navega al detalle
    ├── hooks/useSpaces.ts         useSpaces · useSpaceById · useCreate/UpdateSpace
    ├── navigation/
    │   ├── RootNavigator.tsx      Tab + Stack (Home, Detail, Create, Edit)
    │   └── types.ts               Listas de params tipadas
    ├── schemas/spaceSchema.ts     Reglas Zod + tipos inferidos
    ├── screens/
    │   ├── HomeScreen.tsx         Lista con estados de red
    │   ├── DetailScreen.tsx       Detalle + botón de editar en el header
    │   ├── CreateScreen.tsx       Formulario de creación validado
    │   ├── EditScreen.tsx         Formulario de edición con reset()
    │   └── SavedScreen.tsx        Guardados (Zustand)
    ├── services/api.ts            Instancia de Axios
    ├── stores/savedStore.ts       Estado global (Zustand)
    ├── theme/index.ts             COLORS · TYPOGRAPHY · SPACING · RADIUS
    ├── types/index.ts             Space · payloads de crear y actualizar
    └── utils/                     format · spaceMapper
```

## Cómo ejecutar

Desde tu copia del repositorio (mira la portada si aún no la tienes):

```bash
git checkout semana-06
pnpm install
pnpm start
```

Al cambiar de rama vuelve a ejecutar `pnpm install`: cada semana puede traer
dependencias nuevas.

Necesita internet, igual que la semana 05: el catálogo y los datos del formulario
de edición vienen de la API.

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
| `06-validacion.png` | Errores de Zod bajo los campos | Tocar *Publicar* con el formulario vacío |
| `06-editar.png` | Edición con datos del servidor | Detalle → ícono de lápiz del header |

Las capturas de esta entrega van en
[`capturas/`](capturas/), dentro de esta rama.

## Rama y commit de esta semana

Rama **`semana-06`** (una de las 9 ramas encadenadas del repositorio), con el commit:

`Semana 06 — Formularios con React Hook Form + Zod`
