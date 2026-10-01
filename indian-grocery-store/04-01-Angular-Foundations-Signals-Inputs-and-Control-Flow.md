# Angular Foundations — Signals, Input Properties, and Template Control Flow

## Topics Covered

1. **Handling Asynchronous Changes with Signals**
2. **Passing Data to Child Components with Input Properties**
3. **Rendering Lists with @for**
4. **Conditionally Rendering Content with @if / @else**
5. **Using CurrencyPipe**

This section builds directly on the previous data-binding lesson.

We already saw that a normal property changed inside `setTimeout()` did not automatically refresh the UI in the course's zoneless Angular setup.

Now we solve that problem with **Signals**, make `ProductDetailsComponent` truly reusable with **input properties**, and use Angular template control flow to render products dynamically.

```text
Signal
   ↓
reactive state updates

Parent component
   ↓
passes product data

Child component
   ↓
renders one product

@for
   ↓
renders many products

@if / @else
   ↓
renders content conditionally
```

---

## Handling Asynchronous Changes with Signals

Previously, inventory was a normal property:

```ts
availableInventory = 5;
```

When it changed asynchronously inside `setTimeout()`, Angular was not automatically notified.

A **Signal** solves this by storing a value in reactive state that Angular can track.

Import `signal`:

```ts
import { Component, signal } from '@angular/core';
```

Create the signal:

```ts
availableInventory = signal(5);
```

Conceptually:

```text
availableInventory
        ↓
WritableSignal<number>
        ↓
stores 5
        ↓
can notify Angular when changed
```

### Reading a Signal

Read a signal by calling it like a function:

```html
<p>{{ availableInventory() }}</p>
```

Memory rule:

```text
signal value
→ read with ()
```

### Updating a Signal with `set()`

Use `set()` when replacing the value directly:

```ts
this.availableInventory.set(2);
```

```text
5
↓
set(2)
↓
2
↓
Angular is notified
↓
UI updates
```

### Updating a Signal with `update()`

Use `update()` when the new value depends on the previous value:

```ts
this.availableInventory.update(
  (previous) => previous - 1
);
```

Example:

```text
5 → 4 → 3 → 2
```

| Method | Use when |
|---|---|
| `set(value)` | Replace the value directly |
| `update(previous => newValue)` | New value depends on the old value |

Our updated `addToCart()`:

```ts
addToCart(event: MouseEvent) {
  setTimeout(() => {
    this.availableInventory.update(
      (previous) => previous - 1
    );
  }, 100);

  console.log(event);
}
```

Flow:

```text
Buy clicked
    ↓
setTimeout()
    ↓
100 ms later
    ↓
signal.update(...)
    ↓
Signal changes
    ↓
Angular is notified
    ↓
UI updates
```

The temporary `DoNothing` button is no longer needed.

---

## Passing Data to Child Components with Input Properties

Our `ProductDetailsComponent` previously contained a hard-coded product.

That limits reusability because every instance would display the same product.

What we really want is:

```text
CatalogComponent
      ↓
chooses product
      ↓
passes product into child
      ↓
ProductDetailsComponent
      ↓
renders that product
```

Angular uses **input properties** for this parent-to-child data flow.

### Define a Required Input in the Child

Import `input`:

```ts
import { Component, input, signal } from '@angular/core';
```

Then define:

```ts
product = input.required<IProduct>();
```

This means:

```text
product
   ↓
InputSignal<IProduct>
   ↓
must be supplied by the parent
```

Because it is a signal, read it by calling:

```ts
product()
```

So instead of:

```html
{{ product.name }}
```

we now use:

```html
{{ product().name }}
```

The same applies everywhere:

```html
{{ product().description }}
{{ product().category }}
{{ product().price }}
```

And when passing it into a method:

```html
[src]="getImageUrl(product())"
```

### Why `input.required<IProduct>()`?

Using:

```ts
input.required<IProduct>()
```

tells Angular and TypeScript:

> This child component requires product data from its parent.

That gives the component a clear contract.

---

## Parent Component Supplies the Product

The Catalog component owns the product collection:

```ts
import { Component } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import allProducts from '../products.json';

@Component({
  selector: 'store-catalog',
  imports: [ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  products = allProducts;
}
```

The parent passes a product into the child using property binding:

```html
<store-product-details
  [product]="products[0]">
</store-product-details>
```

Flow:

```text
CatalogComponent
      ↓
products[0]
      ↓
[product]
      ↓
ProductDetailsComponent
      ↓
product()
```

---

## Rendering Lists

Manually writing a child component for every product does not scale.

Angular provides the `@for` control-flow block:

```html
<ul>
  @for (prod of products; track prod.id) {
    <li>
      <store-product-details
        [product]="prod">
      </store-product-details>
    </li>
  }
</ul>
```

The idea is:

```text
products array
      ↓
@for
      ↓
one prod at a time
      ↓
one ProductDetailsComponent
      ↓
repeat for every product
```

If the array contains 10 products:

```text
10 products
    ↓
@for
    ↓
10 rendered child components
```

### Understanding `track prod.id`

Angular uses `track` to uniquely identify each rendered item:

```html
@for (prod of products; track prod.id)
```

Here:

```text
prod.id
```

uniquely identifies each product.

Why it matters:

```text
One product changes
      ↓
Angular identifies it by id
      ↓
updates the correct DOM item efficiently
```

Memory rule:

```text
@for
→ repeat content

track
→ identify each item
```

---

## Conditionally Rendering Content

Angular provides `@if` and `@else` for conditional rendering.

Our products can have a discount.

We want to show a sale price only when:

```ts
product().discount > 0
```

Template:

```html
@if (product().discount > 0) {
  <p>
    {{ product().price * (1 - product().discount) | currency }}
    (Sale)
  </p>
} @else {
  <p>
    {{ product().price | currency }}
  </p>
}
```

Flow:

```text
Does product have a discount?
           ↓
     discount > 0 ?
       ↙         ↘
     YES          NO
      ↓            ↓
Sale price     Normal price
```

This is Angular's template version of regular branching logic:

```ts
if (...) {
  ...
} else {
  ...
}
```

---

## Currency Pipe

The discounted-price example uses Angular's built-in `currency` pipe:

```html
{{ product().price | currency }}
```

Because this is a standalone component, import `CurrencyPipe`:

```ts
import { CurrencyPipe } from '@angular/common';
```

and add it to the component:

```ts
@Component({
  selector: 'store-product-details',
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
```

The pipe is supporting syntax here; the main topic is conditional rendering.

---

## Current `ProductDetailsComponent`

```ts
import { CurrencyPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';

@Component({
  selector: 'store-product-details',
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product = input.required<IProduct>();

  availableInventory = signal(5);

  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }

  addToCart(event: MouseEvent) {
    setTimeout(() => {
      this.availableInventory.update(
        (previous) => previous - 1
      );
    }, 100);

    console.log(event);
  }
}
```

---

## Current `product-details.component.html`

```html
<div class="product">

  <img
    [src]="getImageUrl(product())"
    [alt]="product().name"
  />

  <div class="details">
    <div>

      <h2>{{ product().name }}</h2>

      <p>{{ product().description }}</p>

      <p>
        Available Inventory:
        {{ availableInventory() }}
      </p>

      <p>
        Category Type:
        {{ product().category }}
      </p>

    </div>
  </div>

  <div class="price">

    @if (product().discount > 0) {

      <p>
        {{ product().price * (1 - product().discount) | currency }}
        (Sale)
      </p>

    } @else {

      <p>
        {{ product().price | currency }}
      </p>

    }

    <button
      class="cta"
      (click)="addToCart($event)">
      Buy
    </button>

  </div>

</div>
```

---

## Current `CatalogComponent`

```ts
import { Component } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import allProducts from '../products.json';

@Component({
  selector: 'store-catalog',
  imports: [ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  products = allProducts;
}
```

---

## Current `catalog.component.html`

```html
<ul>

  @for (prod of products; track prod.id) {

    <li>

      <store-product-details
        [product]="prod">
      </store-product-details>

    </li>

  }

</ul>
```

---

## How Everything Connects

```text
products.json
     ↓
CatalogComponent
     ↓
products
     ↓
@for
     ↓
prod
     ↓
[product]="prod"
     ↓
ProductDetailsComponent
     ↓
input.required<IProduct>()
     ↓
product()
     ↓
Product UI
```

Inside each product:

```text
ProductDetailsComponent
│
├── product()
│     ↓
│   product data
│
├── availableInventory()
│     ↓
│   reactive signal state
│
├── @if / @else
│     ↓
│   decide which price to display
│
└── addToCart()
      ↓
    update inventory signal
```

---

## Signals & Control Flow Cheat Sheet

```ts
availableInventory = signal(5);
```

```text
availableInventory() → read
set(value)            → replace value
update(previous => …) → calculate from previous value
```

```ts
product = input.required<IProduct>();
```

```html
<store-product-details [product]="prod"></store-product-details>
```

```text
input.required<T>()
→ child requires data from parent

product()
→ read the input signal
```

```html
@for (prod of products; track prod.id) {
  ...
}

@if (product().discount > 0) {
  ...
} @else {
  ...
}
```

```text
@for        → render a collection
track       → identify each item
@if / @else → conditional rendering
CurrencyPipe → format currency values
```
