# Angular Foundations — Template Syntax and Data Binding

Until now, our Angular templates mostly contained regular HTML.

This section introduces how Angular connects the **component class** to the **template** so the UI can display data, react to user actions, and stay synchronized when data changes.

```text
Component
   ↓
data + methods
   ↓
Template
   ↓
UI
```

And when the user interacts with the page:

```text
User
   ↓
Template event
   ↓
Component method
```

---

## Using Interpolation to Render Expressions

Interpolation lets Angular evaluate an expression inside the template.

Syntax:

```html
{{ expression }}
```

Example:

```html
<p>2 + 2 = {{ 2 + 2 }}</p>
```

Angular evaluates the expression and renders:

```text
2 + 2 = 4
```

Interpolation should stay simple. Complex logic belongs in the component class rather than inside the HTML.

```text
Template
→ display simple expressions

Component
→ application logic
```

---

## Binding to Component Data with Interpolation

The real value of interpolation is displaying data from the component.

Our product shape is defined with an interface:

```ts
export interface IProduct {
  id: number;
  name: string;
  description: string;
  imageName: string;
  category: string;
  price: number;
  discount: number;
}
```

Our `ProductDetailsComponent` contains one product:

```ts
product: IProduct;

constructor() {
  this.product = {
    id: 9,
    name: 'Rice',
    description:
      'Everyday rice suitable for curries, dal, pulao, and other Indian meals.',
    imageName: 'BasmatiRice.png',
    category: 'Grains',
    price: 12.99,
    discount: 0,
  };
}
```

Instead of hard-coding product values in HTML:

```html
<h2>Rice</h2>
```

we bind the template to the component:

```html
<h2>{{ product.name }}</h2>

<p>{{ product.description }}</p>

<p>Category Type: {{ product.category }}</p>

<p>${{ product.price }}</p>
```

Flow:

```text
ProductDetailsComponent
        ↓
product.name
        ↓
{{ product.name }}
        ↓
Rice
```

The important change is:

```text
Before
HTML owns the product values

Now
Component owns the product values
        ↓
Template displays them
```

Later, the same product data can come from an API instead of being created directly in the component.

---

## Using Property Bindings

Interpolation is useful when displaying text.

When we want to set an HTML element property such as `src` or `alt`, Angular provides **property binding**.

Syntax:

```html
[property]="expression"
```

Example:

```html
<img [alt]="product.name">
```

The square brackets tell Angular to evaluate the value as an expression.

Without binding:

```html
<img alt="product.name">
```

the browser sees the literal text:

```text
product.name
```

With binding:

```html
<img [alt]="product.name">
```

Angular evaluates the expression and uses:

```text
Rice
```

Property binding is one-way:

```text
Component
   ↓
Template
```

For example:

```html
<input [value]="product.name">
```

If `product.name` changes in the component, the UI can update.

Typing in the input does not automatically update `product.name`.

---

## Binding the Product Image

Our image file is stored here:

```text
public/assets/BasmatiRice.png
```

But Angular serves the contents of `public/` from the application root:

```text
public/assets/BasmatiRice.png
             ↓
/assets/BasmatiRice.png
```

The product stores only the filename:

```ts
imageName: 'BasmatiRice.png'
```

So the final image URL must be built from:

```text
/assets/
+
BasmatiRice.png
```

---

## Calling Functions from a Component Template

A template can bind to the return value of a component method.

Instead of building the image path directly in the HTML, we created:

```ts
getImageUrl(product: IProduct) {
  return '/assets/' + product.imageName;
}
```

Then the template binds `src` to the result:

```html
<img
  [src]="getImageUrl(product)"
  [alt]="product.name"
/>
```

Flow:

```text
product.imageName
      ↓
BasmatiRice.png
      ↓
getImageUrl(product)
      ↓
/assets/BasmatiRice.png
      ↓
[src]
      ↓
Image displays
```

This keeps more logic inside the component and keeps the template easier to read.

---

## Responding to User Events

Angular can also respond to browser events such as:

```text
click
keyup
change
input
```

Event binding uses parentheses:

```html
(event)="method()"
```

Our Buy button:

```html
<button
  class="cta"
  (click)="addToCart(product, $event)">
  Buy
</button>
```

When the user clicks:

```text
User clicks Buy
      ↓
(click)
      ↓
addToCart(...)
      ↓
Component method runs
```

Our temporary method:

```ts
addToCart(product: IProduct, event: MouseEvent) {
  product.name += ' - Added to cart';
  console.log(event);
}
```

For now, this is only demonstrating event binding. The real cart functionality will come later.

### `$event`

Angular provides information about the browser event through:

```text
$event
```

Example:

```html
(click)="addToCart(product, $event)"
```

The component receives it as:

```ts
event: MouseEvent
```

The event can contain information such as the clicked element and pointer coordinates.

Use `$event` only when the component actually needs that information.

---

## Interpolation vs Property Binding vs Event Binding

These three Angular syntaxes are important to remember together:

| Syntax | Direction | Purpose |
|---|---|---|
| `{{ value }}` | Component → Template | Display data |
| `[property]="value"` | Component → Template | Set an element or component property |
| `(event)="method()"` | Template → Component | Respond to an event |

Memory rule:

```text
{{ }}
→ display data

[ ]
→ send data into a property

( )
→ react to an event
```

---

## Data Bindings and Angular Change Detection

When component data changes, Angular needs to know that something changed so it can update the UI.

That process is called **change detection**.

```text
Data changes
    ↓
Angular detects the change
    ↓
Angular checks bindings
    ↓
UI updates
```

Example:

```html
<h2>{{ product.name }}</h2>
```

When clicking the Buy button changes:

```ts
product.name
```

Angular handles the click event and updates the template.

```text
Click Buy
   ↓
addToCart()
   ↓
product.name changes
   ↓
Angular detects the event
   ↓
{{ product.name }} updates
```

This keeps the component data and the screen synchronized.

---

## Demonstrating Asynchronous Changes

We added inventory to the component:

```ts
availableInventory = 5;
```

and displayed it:

```html
<p>Available Inventory: {{ availableInventory }}</p>
```

Then the Buy button changes that value after three seconds:

```ts
setTimeout(() => {
  this.availableInventory = 2;
}, 3000);
```

In the zoneless Angular setup used by the course:

```text
availableInventory = 5
        ↓
Buy clicked
        ↓
setTimeout starts
        ↓
3 seconds later
        ↓
availableInventory = 2
        ↓
Angular was not notified
        ↓
UI still shows 5
```

The TypeScript value really changed.

The issue is that Angular did not know it needed to refresh the binding after that asynchronous plain-property update.

---

## Why the `DoNothing` Button Updates the UI

The lesson temporarily added:

```html
<button
  class="cta"
  (click)="false">
  DoNothing
</button>
```

This button does not intentionally change the inventory.

But clicking it gives Angular another event to process.

```text
availableInventory is already 2
        ↓
Click DoNothing
        ↓
Angular checks bindings again
        ↓
Angular sees 2
        ↓
UI updates
```

This proves that the value changed correctly.

The missing piece was change detection.

The `DoNothing` button is only a teaching example, not a real solution.

---

## Why Signals Are Next

The asynchronous example introduces the reason Angular Signals are useful.

With a normal property:

```text
async code changes value
        ↓
Angular may not know
```

With reactive state such as a Signal:

```text
Signal changes
      ↓
Angular is notified
      ↓
UI updates
```

Signals will be covered next.

---

## Current Product Details Example

### `product.model.ts`

```ts
export interface IProduct {
  id: number;
  name: string;
  description: string;
  imageName: string;
  category: string;
  price: number;
  discount: number;
}
```

### `product-details.component.ts`

```ts
import { Component } from '@angular/core';
import { IProduct } from '../product.model';

@Component({
  selector: 'store-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product: IProduct;
  availableInventory = 5;

  constructor() {
    this.product = {
      id: 9,
      name: 'Rice',
      description:
        'Everyday rice suitable for curries, dal, pulao, and other Indian meals.',
      imageName: 'BasmatiRice.png',
      category: 'Grains',
      price: 12.99,
      discount: 0,
    };
  }

  getImageUrl(product: IProduct) {
    return '/assets/' + product.imageName;
  }

  addToCart(product: IProduct, event: MouseEvent) {
    product.name += ' - Added to cart';

    setTimeout(() => {
      this.availableInventory = 2;
    }, 3000);

    console.log(event);
  }
}
```

### `product-details.component.html`

```html
<div class="product">

  <img
    [src]="getImageUrl(product)"
    [alt]="product.name"
  />

  <div class="details">
    <div>
      <h2>{{ product.name }}</h2>

      <p>{{ product.description }}</p>

      <p>
        Available Inventory:
        {{ availableInventory }}
      </p>

      <p>
        Category Type:
        {{ product.category }}
      </p>
    </div>
  </div>

  <div class="price">

    <p>${{ product.price }}</p>

    <button
      class="cta"
      (click)="addToCart(product, $event)">
      Buy
    </button>

    <button
      class="cta"
      (click)="false">
      DoNothing
    </button>

  </div>

</div>
```

---

## Quick Review

```text
Interpolation
{{ product.name }}
→ display component data
```

```text
Property binding
[src]="getImageUrl(product)"
→ Component → Template
```

```text
Event binding
(click)="addToCart(...)"
→ Template → Component
```

```text
$event
→ information about the browser event
```

```text
Change detection
→ Angular notices changes
→ UI stays synchronized
```

```text
Async plain-property change
→ Angular may not be notified in zoneless mode
→ Signals are the next solution
```

---

## Main Idea

Angular templates are more than HTML.

They are connected to the component through bindings:

```text
               COMPONENT
              ↙         ↘
          data           methods
           ↓               ↑
       {{ }} / [ ]         ( )
           ↓               ↑
              TEMPLATE
                 ↑
                USER
```

Interpolation displays component data, property binding sets element properties, event binding sends user actions back to the component, and change detection keeps the UI synchronized with changing application state.
