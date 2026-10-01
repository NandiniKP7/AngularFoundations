# Angular Foundations — Component Styling

## Topics Covered

1. **Angular CSS: Global Styles Versus Component Styles**
2. **Conditionally Applying CSS Classes with Class Bindings**
3. **Applying CSS Classes with the ngClass Directive**
4. **Styling a Component's Host Element**

Angular gives us two main ways to style an application:

```text
Global styles
→ affect the whole application

Component styles
→ affect only one component
```

This section also introduces dynamic CSS classes with Angular bindings and the `:host` selector for styling the component element itself.

---

## Angular CSS: Global Styles Versus Component Styles

In regular HTML and CSS, styles are global by default.

For example:

```css
.product {
  border: 1px solid #999;
}
```

could affect any element using:

```html
class="product"
```

anywhere on the page.

Angular gives us more control.

### Global Styles

The default global stylesheet is:

```text
src/styles.css
```

Styles placed here can affect the entire application.

Example:

```css
button {
  background-color: blue;
}

button.cta {
  background-color: pink;
}
```

These rules can apply to buttons throughout the Angular app.

The global stylesheet is configured in:

```text
angular.json
```

Angular stores global stylesheet paths in the `styles` array, which means additional global CSS files can also be added if needed.

```text
angular.json
     ↓
styles[]
     ↓
global CSS files
```

---

### Component Styles

A component can also have its own stylesheet.

For `ProductDetailsComponent`:

```text
product-details.component.ts
product-details.component.html
product-details.component.css
```

The component connects to its stylesheet through:

```ts
@Component({
  selector: 'store-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
```

Styles inside:

```text
product-details.component.css
```

apply only to that component.

Example:

```css
.blue-border {
  border: 3px solid blue;
}
```

If the class is used inside `ProductDetailsComponent`:

```html
<div class="blue-border">
```

the blue border appears.

But using the same class inside `CatalogComponent` will not work unless that style also exists in the Catalog component styles or in a global stylesheet.

```text
ProductDetails CSS
       ↓
ProductDetails only

Catalog CSS
       ↓
Catalog only
```

This helps prevent one component's styles from accidentally changing another component.

---

## Conditionally Applying CSS Classes with Class Bindings

Some products in our store have a discount.

We want to show the original price for every product, but cross it out only when the product is discounted.

Our CSS class:

```css
.strikethrough {
  text-decoration: line-through;
  font-size: 18px;
}
```

Angular lets us apply that class conditionally with a class binding:

```html
<p
  [class.strikethrough]="product().discount > 0">
  ${{ product().price }}
</p>
```

The syntax is:

```html
[class.className]="condition"
```

Angular evaluates the condition:

```text
product().discount > 0
        ↓
      true?
     ↙     ↘
   YES      NO
    ↓        ↓
apply      don't apply
class        class
```

So:

```html
[class.strikethrough]="product().discount > 0"
```

means:

> Apply the `strikethrough` CSS class only when the product has a discount.

This is useful when you need to conditionally apply one class.

---

## Applying CSS Classes with the `ngClass` Directive

A single class binding works well for one class:

```html
[class.strikethrough]="product().discount > 0"
```

When several classes may need to be applied dynamically, Angular provides `NgClass`.

First import it:

```ts
import { NgClass } from '@angular/common';
```

Then add it to the standalone component imports:

```ts
@Component({
  selector: 'store-product-details',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
```

Now the template can use:

```html
<p
  [ngClass]="{
    strikethrough: product().discount > 0
  }">
  ${{ product().price }}
</p>
```

The object means:

```text
CSS class name
      ↓
strikethrough

Condition
      ↓
product().discount > 0
```

If the condition is true, Angular applies that class.

---

### Multiple Conditional Classes

`ngClass` can also manage several classes:

```html
<p
  [ngClass]="{
    strikethrough: product().discount > 0,
    'sale-price': product().discount > 0
  }">
```

If a class name contains a hyphen, write it as a string:

```ts
'sale-price'
```

because:

```text
sale-price
```

is not a valid JavaScript property name without quotes.

---

## Keeping Class Logic in the Component

Instead of putting a larger object directly in the HTML, we can move the logic into the component class.

Template:

```html
<p [ngClass]="getPriceClasses()">
  ${{ product().price }}
</p>
```

Component:

```ts
getPriceClasses() {
  return {
    strikethrough: this.product().discount > 0
  };
}
```

Flow:

```text
Template
   ↓
getPriceClasses()
   ↓
returns class object
   ↓
ngClass
   ↓
Angular applies matching classes
```

This keeps the template cleaner when class logic starts becoming more complex.

---

## Class Binding vs `ngClass`

| Syntax | Best for |
|---|---|
| `[class.name]="condition"` | One simple conditional class |
| `[ngClass]="..."` | Multiple or more complex dynamic classes |

Examples:

```html
[class.strikethrough]="product().discount > 0"
```

and:

```html
[ngClass]="getPriceClasses()"
```

Both can solve the same problem when only one class is involved.

The choice becomes more useful when the styling logic grows.

---

## Styling a Component's Host Element

Our `ProductDetailsComponent` originally had an outer wrapper:

```html
<div class="product">
  ...
</div>
```

That wrapper existed mainly so we could style the whole component.

But Angular components already have an element in the DOM.

Because our selector is:

```ts
selector: 'store-product-details'
```

the browser contains:

```html
<store-product-details>
  ...
</store-product-details>
```

That element is the component's **host element**.

Angular lets us style it using:

```css
:host
```

---

### Before

Template:

```html
<div class="product">
  ...
</div>
```

CSS:

```css
.product {
  display: flex;
  justify-content: space-between;
  padding: 20px 25px;
  border-bottom: 2px solid #999;
}
```

---

### After

We can remove the unnecessary wrapper and style the host directly:

```css
:host {
  display: flex;
  justify-content: space-between;
  padding: 20px 25px;
  border-bottom: 2px solid #999;
}
```

If we need to style an image inside the component:

```css
:host img {
  width: 125px;
  margin-right: 25px;
}
```

This means:

```text
:host
→ the <store-product-details> element itself

:host img
→ img elements inside that component
```

---

## Why Use `:host`?

Without `:host`, we may create an extra wrapper only for styling:

```text
store-product-details
        ↓
<div class="product">
        ↓
actual content
```

With `:host`:

```text
store-product-details
        ↓
actual content
```

So if a wrapper exists only to style the entire component, consider styling the host element instead.

---

## Current `ProductDetailsComponent`

```ts
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { IProduct } from '../product.model';

@Component({
  selector: 'store-product-details',
  imports: [CurrencyPipe, NgClass],
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
    setTimeout(
      () => this.availableInventory.update((p) => p - 1),
      100
    );

    console.log(event);
  }

  getPriceClasses() {
    return {
      strikethrough: this.product().discount > 0
    };
  }
}
```

---

## Current `product-details.component.html`

```html
<img
  [src]="getImageUrl(product())"
  [alt]="product().name"
/>

<div class="details">
  <div>
    <h2>{{ product().name }}</h2>

    <p>{{ product().description }}</p>

    <p>{{ availableInventory() }}</p>

    <p>
      Category Type:
      {{ product().category }}
    </p>
  </div>
</div>

<div class="price">

  <p [ngClass]="getPriceClasses()">
    ${{ product().price }}
  </p>

  @if (product().discount > 0) {
    <p>
      {{ product().price * (1 - product().discount) | currency }}
      (Sale)
    </p>
  }

  <button
    class="cta"
    (click)="addToCart($event)">
    Buy
  </button>

</div>
```

---

## Current `product-details.component.css`

```css
:host {
  display: flex;
  justify-content: space-between;
  padding: 20px 25px;
  border-bottom: 2px solid #999;
}

.details {
  display: flex;
  align-items: center;
}

:host img {
  width: 125px;
  margin-right: 25px;
}

.price {
  font-size: 25px;
  border-left: 2px solid #aaa;
  padding-left: 10px;
  text-align: center;
  min-width: 190px;
}

.price p {
  margin: 0;
}

.price button {
  padding: 10px;
  width: 100px;
  display: block;
  margin: 10px auto;
}

.discount {
  margin-top: -15px;
  color: #d25ca1;
}

.strikethrough {
  text-decoration: line-through;
  font-size: 18px;
}
```

---

## How Everything Connects

```text
styles.css
   ↓
global styles
   ↓
whole application
```

```text
product-details.component.css
   ↓
component styles
   ↓
ProductDetailsComponent only
```

Dynamic styling:

```text
product().discount
        ↓
condition
        ↓
[class...] / [ngClass]
        ↓
CSS class applied
```

Component-level styling:

```text
<store-product-details>
        ↓
:host
        ↓
style the component element itself
```

---

## Component Styling Cheat Sheet

```text
src/styles.css
→ global styles

component.css
→ styles scoped to that component
```

```html
<p [class.strikethrough]="product().discount > 0">
```

```text
[class.className]
→ apply one CSS class conditionally
```

```html
<p [ngClass]="getPriceClasses()">
```

```text
ngClass
→ useful when applying multiple/dynamic classes
→ import NgClass in a standalone component
```

```css
:host {
  display: grid;
}
```

```text
:host
→ styles the component's own host element
```
