# Angular Foundations — Managing Application State with Angular Services

## Topics Covered

1. **Managing Application State with Angular Services**

This lesson connects the **Catalog** and **Cart** using one shared `CartService`.

Before:

```text
Catalog
→ Buy did not really add to Cart

Cart
→ used hard-coded products
```

Now:

```text
Catalog
   ↓
CartService
   ↓
shared cart state
   ↓
Cart
```

---

## Managing Application State with Angular Services

A service can store data that multiple components need.

For our app:

```text
CartService
→ stores the cart
→ adds products
→ removes products
```

This gives both the Catalog side and Cart side access to the same cart state.

---

### Creating the Cart Service

Create the service:

```bash
ng g service cart --type=service
```

**File:**

```text
src/app/cart.service.ts
```

We store the cart in a Signal:

```ts
cart = signal<IProduct[]>([]);
```

```text
cart
→ Signal

IProduct[]
→ array of products

[]
→ starts empty

cart()
→ current cart value
```

---

### Adding Products to the Cart

The **Buy** button is inside `ProductDetailsComponent`.

So `ProductDetailsComponent` needs `CartService`.

**File:**

```text
src/app/product-details/product-details.component.ts
```

Inject the service:

```ts
constructor(private cartService: CartService) {
}
```

Then inside `addToCart()`:

```ts
this.cartService.addItemsTocart(
  this.product()
);
```

```text
this.product()
→ current product

addItemsTocart(...)
→ send that product to CartService
```

---

### Adding the Product Inside `CartService`

**File:**

```text
src/app/cart.service.ts
```

```ts
addItemsTocart(product: IProduct) {
  this.cart.update(
    cart => [...cart, product]
  );
}
```

```text
cart
→ current cart value

...cart
→ spread operator
→ gets all existing items

product
→ new item to add

Example:

[Rajma, Chana] + Poha
        ↓
[Rajma, Chana, Poha]

update()
→ saves the new array back into the cart Signal
```

So:

```text
existing cart
+
new product
=
new cart
```

---

### Reading the Shared Cart in `CartComponent`

The Cart page no longer needs hard-coded products.

It can use the cart from `CartService`.

**File:**

```text
src/app/cart/cart.component.ts
```

```ts
cartItems = signal<IProduct[]>([]);

constructor(private cartService: CartService) {
  this.cartItems = this.cartService.cart;
}
```

```text
CartService.cart
→ shared cart Signal

cartItems
→ points to that same Signal
```

Because `cartItems` is a Signal, the template reads it with:

```html
cartItems()
```

**File:**

```text
src/app/cart/cart.component.html
```

```html
<h1 class="header">Your Cart</h1>

<ul class="cart">
  @for (prod of cartItems(); track prod.id) {
    <li>
      <store-cart-items [product]="prod"/>
    </li>
  }
</ul>
```

```text
cartItems()
→ current cart array

@for
→ renders each product
```

---

### Removing Products from the Cart

The **Remove** button is inside `CartItemComponent`.

So `CartItemComponent` also needs `CartService`.

**File:**

```text
src/app/cart-items/cart-items.component.ts
```

Inject the service:

```ts
constructor(private cartService: CartService) {
}
```

Then:

```ts
removeFromCart() {
  this.cartService.removeItemsFromCart(
    this.product()
  );
}
```

```text
this.product()
→ product being removed

removeItemsFromCart(...)
→ send that product to CartService
```

---

### Removing the Product Inside `CartService`

**File:**

```text
src/app/cart.service.ts
```

```ts
removeItemsFromCart(product: IProduct) {
  this.cart.update(
    cart => cart.filter(
      p => p.id != product.id
    )
  );
}
```

```text
cart
→ current cart value

filter()
→ checks every product

p
→ one product at a time

p.id != product.id
→ keep products that do NOT match
  the product being removed

Example:

[Rajma, Chana, Poha]

Remove Chana
      ↓
[Rajma, Poha]

update()
→ saves the filtered array back into the cart Signal
```

---

### Why the Cart Needs to Be Reactive

The first version used a normal array:

```ts
cart: IProduct[] = [];
```

The cart data could change, but the Cart UI did not always update immediately.

After changing it to:

```ts
cart = signal<IProduct[]>([]);
```

Angular can react when the cart changes.

```text
cart Signal changes
      ↓
Angular notices
      ↓
Cart template updates
      ↓
UI updates immediately
```

That is why the shared cart state is stored in a Signal.

---

## How Everything Connects

```text
ProductDetailsComponent
        ↓
      Buy
        ↓
CartService.addItemsTocart()
        ↓
     cart Signal
        ↓
   CartComponent
        ↓
   cartItems()
        ↓
      @for
        ↓
CartItemComponent
        ↓
     Remove
        ↓
CartService.removeItemsFromCart()
        ↓
     cart Signal
        ↓
   UI updates
```

---

## Cart State Cheat Sheet

```ts
cart = signal<IProduct[]>([]);
```

```text
cart()
→ read current cart
```

```ts
this.cart.update(
  cart => [...cart, product]
);
```

```text
...cart
→ existing items

product
→ new item

[...cart, product]
→ existing items + new item
```

```ts
this.cart.update(
  cart => cart.filter(
    p => p.id != product.id
  )
);
```

```text
filter()
→ keeps products that do not match
  the product being removed
```

```text
CartService
→ shared cart state

ProductDetailsComponent
→ adds products

CartComponent
→ reads cart

CartItemComponent
→ removes products

Signal
→ keeps Cart UI reactive
```
