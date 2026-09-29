# Angular Foundations — Template Syntax and Data Binding

Until now, most of the HTML in our components was static.

Angular becomes much more useful when the template can display data from the component and respond to user actions.

The basic idea is:

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

## Interpolation — Display Component Data

Interpolation uses double curly braces:

```html
{{ expression }}
```

Angular evaluates the expression and displays the result.

Example:

```html
<p>2 + 2 = {{ 2 + 2 }}</p>
```

renders:

```text
2 + 2 = 4
```

The more useful case is displaying component data.

Our product is defined in the component:

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

The template can read that data:

```html
<h2>{{ product.name }}</h2>

<p>{{ product.description }}</p>

<p>Category Type: {{ product.category }}</p>

<p>${{ product.price }}</p>
```

So instead of hard-coding:

```html
<h2>Rice</h2>
```

we now have:

```html
<h2>{{ product.name }}</h2>
```

The data lives in TypeScript, and the template displays it.

```text
product.name
    ↓
{{ product.name }}
    ↓
Rice
```

### Keep complex logic out of the template

Interpolation expressions should stay simple.

Angular templates are for displaying data and connecting UI behavior.

More complicated logic belongs in the component class.

```text
Template
→ simple expressions

Component
→ application logic
```

---

## Product Model — Define the Shape of Product Data

We created an interface for our product:

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

This tells TypeScript what a valid product must contain.

```text
IProduct
│
├── id          → number
├── name        → string
├── description → string
├── imageName   → string
├── category    → string
├── price       → number
└── discount    → number
```

The component property uses that type:

```ts
product: IProduct;
```

For now the product is created directly inside the component.

Later the same type can be used when product data comes from an API.

---

## Property Binding — Set an Element Property

Interpolation is useful when we want to display text.

For HTML properties such as `src` and `alt`, Angular provides **property binding**.

Syntax:

```html
[property]="expression"
```

Example:

```html
<img [alt]="product.name">
```

The square brackets tell Angular:

> Evaluate this as an expression instead of treating it as plain text.

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

Angular evaluates the property and uses:

```text
Rice
```

### Property binding is one-way

```text
Component
   ↓
Template
```

For example:

```html
<input [value]="product.name">
```

If the component value changes, the UI can update.

But if the user types into the input, that does not automatically change `product.name`.

---

## Binding the Product Image

Our image is stored in:

```text
public/assets/BasmatiRice.png
```

In the browser, Angular serves it as:

```text
/assets/BasmatiRice.png
```

The product only stores the filename:

```ts
imageName: 'BasmatiRice.png'
```

Instead of building the full path inside the template, we moved that logic into a function:

```ts
getImageUrl(product: IProduct) {
  return '/assets/' + product.imageName;
}
```

Then bind the `src` property to the function result:

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

This keeps the template cleaner.

---

## Event Binding — Respond to User Actions

Property binding sends data:

```text
Component → Template
```

Event binding goes the other direction:

```text
Template → Component
```

Angular event binding uses parentheses:

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

For now, this is only demonstrating event binding.

The real Cart functionality will come later.

### `$event`

`$event` gives the component information about the browser event.

```html
(click)="addToCart(product, $event)"
```

The receiving parameter is:

```ts
event: MouseEvent
```

This can contain information such as:

```text
clicked element
mouse position
coordinates
other event details
```

Use `$event` only when that information is actually needed.

---

## Interpolation vs Property Binding vs Event Binding

These three syntaxes are worth remembering together:

| Syntax | Direction | Purpose |
|---|---|---|
| `{{ value }}` | Component → Template | Display a value |
| `[property]="value"` | Component → Template | Set an element/component property |
| `(event)="method()"` | Template → Component | Respond to an event |

A simple memory picture:

```text
{{ }}   display data
[ ]     send data into a property
( )     react to an event
```

---

## Change Detection — Keeping the UI in Sync

Suppose the template displays:

```html
<h2>{{ product.name }}</h2>
```

and a button click changes:

```ts
product.name
```

Angular needs to notice the change and update the browser.

That process is called **change detection**.

```text
Data changes
    ↓
Angular detects the change
    ↓
Angular checks the template bindings
    ↓
UI updates
```

Your Buy button demonstrates this:

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

That is why the text changes immediately.

---

## The Async Problem

We then added:

```ts
availableInventory = 5;
```

and displayed it:

```html
<p>{{ availableInventory }}</p>
```

Inside `addToCart()`:

```ts
setTimeout(() => {
  this.availableInventory = 2;
}, 3000);
```

The value really changes after three seconds.

But in the course's zoneless Angular setup, Angular is not automatically notified by this plain asynchronous property update.

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

The important point:

> The TypeScript value changed. The UI simply did not know it needed to refresh.

---

## Why the `DoNothing` Button Changes the Screen

The temporary button:

```html
<button
  class="cta"
  (click)="false">
  DoNothing
</button>
```

does not intentionally change any data.

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

So the button proves that the problem is **change detection**, not `setTimeout()` itself.

This is only a teaching example.

It is not the real solution.

---

## Why Signals Are Next

This async problem introduces the reason Angular Signals are useful.

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
UI can update
```

The next lesson will show how Signals solve this problem.

---

## Current Product Details Flow

Your component now works like this:

```text
ProductDetailsComponent
│
├── product
├── availableInventory
├── getImageUrl()
└── addToCart()
        │
        ↓
product-details.component.html
        │
        ├── {{ product.name }}
        ├── {{ product.description }}
        ├── [src]="getImageUrl(product)"
        ├── [alt]="product.name"
        └── (click)="addToCart(...)"
```

And the data flow is:

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

---

## Quick Memory

```text
{{ }}
→ interpolation
→ display component data
```

```text
[ ]
→ property binding
→ Component → Template
```

```text
( )
→ event binding
→ Template → Component
```

```text
$event
→ information about the browser event
```

```text
Change Detection
→ Angular notices data changes
→ UI stays synchronized
```

```text
Async plain-property change
→ Angular may not be notified in zoneless setup
→ Signals solve this next
```

## Main Takeaway

> Angular templates become dynamic through bindings. Interpolation displays component data, property binding sets element properties, event binding responds to user actions, and change detection keeps the rendered UI synchronized with the component state.
