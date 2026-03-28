---
titulo: "Tipos avanzados en TypeScript que uso a diario"
descripcion: "Más allá de los genéricos básicos: conditional types, mapped types y template literals para escribir código más expresivo y seguro."
fecha: 2025-02-02
etiqueta: typescript
destacado: false
---

Llevar un tiempo usando TypeScript no significa que lo estés aprovechando al máximo. Estos son los patrones que más han cambiado la forma en que escribo código.

## Conditional Types

Permiten que un tipo dependa de una condición, como un ternario pero a nivel de tipos.

```typescript
type EsArray<T> = T extends any[] ? true : false;

type A = EsArray<string[]>; // true
type B = EsArray<string>;   // false
```

## Mapped Types

Transforman las propiedades de un tipo existente de forma sistemática.

```typescript
type Opcional<T> = {
  [K in keyof T]?: T[K];
};

type SoloLectura<T> = {
  readonly [K in keyof T]: T[K];
};
```

## Template Literal Types

Uno de los añadidos más potentes de TypeScript 4.1. Permite construir tipos de string de forma dinámica.

```typescript
type Evento = 'click' | 'focus' | 'blur';
type ManejadorEvento = `on${Capitalize<Evento>}`;
// "onClick" | "onFocus" | "onBlur"
```

## El patrón que más uso

Combinar `keyof` con template literals para crear tipos de acceso seguro a objetos anidados:

```typescript
type Ruta<T, K extends keyof T = keyof T> =
  K extends string
    ? T[K] extends object
      ? `${K}.${Ruta<T[K]>}`
      : K
    : never;
```

La inferencia de tipos de TypeScript es extraordinariamente potente cuando aprendes a trabajar con ella en lugar de contra ella.
