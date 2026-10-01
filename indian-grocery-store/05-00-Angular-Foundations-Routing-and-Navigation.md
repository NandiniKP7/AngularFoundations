# Angular Foundations — Routing and Navigation

## Topics Covered

1. **Preparing Our App for Routing**
2. **Creating Routes for Navigation**
3. **Linking to Routes**

These are the three course topics covered in this README.

This section builds on our component lessons.

Until now, `AppComponent` directly displayed the Catalog component.

That worked while our application had only one page.

Now we added a **Cart page**, which creates a new problem:

```text
How does Angular know
which page to display?
```

We want:

```text
/catalog
   ↓
CatalogComponent

/cart
   ↓
CartComponent
```

Angular solves this with **routing**.

---

## Preparing Our App for Routing

Before routing, `AppComponent` directly displayed a page component.

For example, inside:

```text
src/app/app.html
```

we could write:

```html
<store-catalog></store-catalog>
```

That gives us:

```text
AppComponent
    ↓
app.html
    ↓
<store-catalog>
    ↓
CatalogComponent
```

But if we wanted the Cart page instead, we would have to manually change `app.html`:

```html
<store-cart></store-cart>
```

That is not real navigation.

A user needs to be able to change pages without us changing the source code.

---

### Create the Cart Page

**Where do we create it?**

From the project terminal:

```bash
ng g c cart --type=component
```

Angular creates a folder similar to:

```text
src/app/cart/
│
├── cart.component.ts
├── cart.component.html
├── cart.component.css
└── cart.component.spec.ts
```

Now our application has two page-level components:

```text
CatalogComponent
CartComponent
```

That is why routing is now needed.

---

### Temporary Cart Data

**Where does this code go?**

```text
src/app/cart/cart.component.ts
```

For now:

```ts
import { Component } from '@angular/core';
import { CartItemComponent } from '../cart-items/cart-items.component';
import { IProduct } from '../product.model';
import allProducts from '../products.json';

@Component({
  selector: 'store-cart',
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  cartItems: IProduct[] = [
    allProducts[3],
    allProducts[6]
  ];

}
```

We have not learned shared state management yet, so these products are temporary.

```text
For now

products.json
     ↓
choose two products
     ↓
cartItems[]
     ↓
Cart page
```

Later:

```text
Catalog
   ↓
Buy
   ↓
shared cart state
   ↓
Cart
```

---

### Display the Cart Items

**Where does this code go?**

```text
src/app/cart/cart.component.html
```

```html
<h1 class="header">
  Your Cart
</h1>

<ul class="cart">

  @for (prod of cartItems; track prod.id) {

    <li>

      <store-cart-items
        [product]="prod">
      </store-cart-items>

    </li>

  }

</ul>
```

This reuses concepts we already learned:

```text
cartItems
    ↓
@for
    ↓
prod
    ↓
[product]="prod"
    ↓
CartItemComponent
```

So:

```text
@for
→ repeat products

track prod.id
→ identify each product

[product]="prod"
→ parent passes one product to child
```

---

### Cart Item Component

The Cart displays products similarly to the Catalog.

But the actions are different:

```text
Catalog product
→ Buy

Cart product
→ Remove
```

So the course uses a separate Cart Item component.

Its template contains:

```html
<button
  class="cta"
  (click)="removeFromCart()">
  Remove
</button>
```

The method is intentionally empty for now:

```ts
removeFromCart() {
}
```

Removing an item requires shared cart state, which will be implemented later.

The important result for this lesson is:

```text
Application
│
├── CatalogComponent
└── CartComponent
```

Now routing can decide which page to display.

---

## Creating Routes for Navigation

The problem is now:

```text
We have multiple page components
          ↓
How does a URL choose one?
```

Angular uses a **route**.

A route connects:

```text
URL path
+
Angular component
```

Basic route syntax:

```ts
{
  path: 'catalog',
  component: CatalogComponent
}
```

Read this as:

> When the URL is `/catalog`, Angular should display `CatalogComponent`.

---

### Where Do We Define Routes?

All of our route definitions go in:

```text
src/app/app.routes.ts
```

This is important:

```text
app.routes.ts
→ the place where URLs are mapped to components
```

Our file becomes:

```ts
import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    component: CatalogComponent
  },
  {
    path: 'cart',
    component: CartComponent
  }
];
```

So:

```text
src/app/app.routes.ts

/catalog
→ CatalogComponent

/cart
→ CartComponent

/
→ redirect to /catalog
```

---

### Catalog Route

**File:**

```text
src/app/app.routes.ts
```

Route:

```ts
{
  path: 'catalog',
  component: CatalogComponent
}
```

Flow:

```text
/catalog
    ↓
app.routes.ts
    ↓
path: 'catalog'
    ↓
CatalogComponent
```

---

### Cart Route

**File:**

```text
src/app/app.routes.ts
```

Route:

```ts
{
  path: 'cart',
  component: CartComponent
}
```

Flow:

```text
/cart
   ↓
app.routes.ts
   ↓
path: 'cart'
   ↓
CartComponent
```

---

### How Does Angular Know About `app.routes.ts`?

Our routes are defined here:

```text
src/app/app.routes.ts
```

But Angular also needs those routes when the application starts.

That connection already exists in:

```text
src/app/app.config.ts
```

The important code is:

```ts
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

Conceptually:

```text
app.routes.ts
     ↓
routes
     ↓
app.config.ts
     ↓
provideRouter(routes)
     ↓
Angular Router
```

So the responsibilities are:

```text
app.routes.ts
→ WHAT routes exist?

app.config.ts
→ gives those routes to Angular
```

In our project, this routing configuration was already created when the Angular app was generated.

---

### Where Do Routed Pages Appear?

Defining this:

```ts
{
  path: 'catalog',
  component: CatalogComponent
}
```

answers:

```text
WHICH component?
```

But Angular still needs to know:

```text
WHERE should that component appear?
```

That is the job of:

```html
<router-outlet></router-outlet>
```

---

### Where Do We Add `<router-outlet>`?

This goes in the **root App template**:

```text
src/app/app.html
```

At this point, `app.html` contains:

```html
<router-outlet></router-outlet>
```

Think of it as an empty placeholder:

```text
app.html
   ↓
<router-outlet>
   ↓
Angular inserts
the routed page here
```

If the URL is `/catalog`:

```text
/catalog
   ↓
app.routes.ts
   ↓
CatalogComponent
   ↓
<router-outlet> in app.html
```

If the URL is `/cart`:

```text
/cart
   ↓
app.routes.ts
   ↓
CartComponent
   ↓
same <router-outlet> in app.html
```

The outlet stays in the same location.

The component Angular places inside it changes.

---

### Import `RouterOutlet` into `AppComponent`

Because `app.html` uses:

```html
<router-outlet></router-outlet>
```

the root component must import `RouterOutlet`.

**Where?**

```text
src/app/app.ts
```

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('indian-grocery-store');
}
```

Relationship:

```text
app.ts
imports RouterOutlet
       ↓
app.html
can use
       ↓
<router-outlet>
```

Before routing:

```text
AppComponent
     ↓
directly renders CatalogComponent
```

After routing:

```text
AppComponent
     ↓
RouterOutlet
     ↓
Angular Router decides page
```

---

### Redirect the Home URL

Our app does not have a separate Home component.

We want:

```text
/
```

to send users to:

```text
/catalog
```

**Where do we configure this?**

```text
src/app/app.routes.ts
```

```ts
{
  path: '',
  redirectTo: '/catalog',
  pathMatch: 'full'
}
```

Flow:

```text
/
↓
app.routes.ts
↓
path: ''
↓
redirectTo: '/catalog'
↓
Catalog route
↓
CatalogComponent
```

---

### Understanding `pathMatch: 'full'`

For:

```ts
path: ''
```

we use:

```ts
pathMatch: 'full'
```

For this lesson, remember:

```text
path: ''
→ root/home path

redirectTo
→ send user to another route

pathMatch: 'full'
→ complete path must be empty
```

---

## Linking to Routes

We now have:

```text
/catalog
/cart
```

but users should not have to type these URLs manually.

We need clickable navigation.

Angular provides:

```text
routerLink
```

---

### Create the Site Header

We create it from the terminal:

```bash
ng g c site-header --type=component
```

Angular creates:

```text
src/app/site-header/
│
├── site-header.component.ts
├── site-header.component.html
├── site-header.component.css
└── site-header.component.spec.ts
```

---

### Where Do the Navigation Links Go?

They go inside:

```text
src/app/site-header/site-header.component.html
```

```html
<img
  src="/assets/logo.png"
  alt="Logo">

<a routerLink="/catalog">
  Catalog
</a>

<a routerLink="/cart">
  Cart
</a>
```

So:

```text
Catalog link
→ /catalog

Cart link
→ /cart
```

---

### Why `routerLink` Instead of `href`?

Normal HTML:

```html
<a href="/catalog">Catalog</a>
```

Angular navigation:

```html
<a routerLink="/catalog">Catalog</a>
```

With `routerLink`:

```text
User clicks link
      ↓
Angular Router handles it
      ↓
URL changes
      ↓
route matches
      ↓
RouterOutlet displays page
```

---

### Import `RouterLink`

Because the Site Header template uses:

```html
routerLink
```

the Site Header component needs to import `RouterLink`.

**Where?**

```text
src/app/site-header/site-header.component.ts
```

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'store-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
})
export class SiteHeaderComponent {}
```

Relationship:

```text
site-header.component.ts
imports RouterLink
        ↓
site-header.component.html
can use routerLink
```

---

### Where Do We Add `<store-site-header>`?

The Site Header needs to appear on every page.

Therefore, we put it in the root application template:

```text
src/app/app.html
```

The final `app.html` becomes:

```html
<store-site-header></store-site-header>

<router-outlet></router-outlet>
```

This placement is important.

```text
app.html
│
├── <store-site-header>
│      → always visible
│
└── <router-outlet>
       → Catalog or Cart changes here
```

The Site Header is **outside** the RouterOutlet because we do not want it to disappear when the route changes.

---

### Import `SiteHeaderComponent` into `AppComponent`

Because `app.html` now uses:

```html
<store-site-header></store-site-header>
```

the root component must import `SiteHeaderComponent`.

**Where?**

```text
src/app/app.ts
```

The root component now needs both:

```ts
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './site-header/site-header.component';
```

and:

```ts
imports: [
  RouterOutlet,
  SiteHeaderComponent
]
```

Conceptually:

```text
app.ts
│
├── imports RouterOutlet
│       ↓
│   app.html can use <router-outlet>
│
└── imports SiteHeaderComponent
        ↓
    app.html can use <store-site-header>
```

So the root template:

```html
<store-site-header></store-site-header>

<router-outlet></router-outlet>
```

is supported by the root component imports.

---

## Current Root Application Setup

### `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    component: CatalogComponent
  },
  {
    path: 'cart',
    component: CartComponent
  }
];
```

---

### `src/app/app.config.ts`

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

The important part for routing is:

```ts
provideRouter(routes)
```

---

### `src/app/app.ts`

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './site-header/site-header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SiteHeaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('indian-grocery-store');
}
```

---

### `src/app/app.html`

```html
<store-site-header></store-site-header>

<router-outlet></router-outlet>
```

This is the easiest way to remember the root layout:

```text
App
│
├── Header
│
└── Routed Page
```

---

## How Everything Connects

```text
main.ts
   ↓
starts Angular with appConfig
   ↓
app.config.ts
   ↓
provideRouter(routes)
   ↓
app.routes.ts
   ↓
Angular Router knows:
   │
   ├── /catalog → CatalogComponent
   └── /cart    → CartComponent
```

The visible application structure is:

```text
app.ts
   ↓
AppComponent
   ↓
app.html
│
├── <store-site-header>
│        ↓
│   SiteHeaderComponent
│        ↓
│   routerLink
│
└── <router-outlet>
         ↓
     matched route
         ↓
 CatalogComponent
       OR
 CartComponent
```

When the user clicks **Cart**:

```text
site-header.component.html
        ↓
routerLink="/cart"
        ↓
Angular Router
        ↓
app.routes.ts
        ↓
path: 'cart'
        ↓
CartComponent
        ↓
router-outlet in app.html
        ↓
Cart page appears
```

When the user clicks **Catalog**:

```text
site-header.component.html
        ↓
routerLink="/catalog"
        ↓
Angular Router
        ↓
app.routes.ts
        ↓
path: 'catalog'
        ↓
CatalogComponent
        ↓
router-outlet in app.html
        ↓
Catalog page appears
```

---

## File Map to Remember

```text
src/app/app.routes.ts
→ define routes

src/app/app.config.ts
→ provide routes to Angular

src/app/app.ts
→ import RouterOutlet + SiteHeaderComponent

src/app/app.html
→ place <store-site-header>
→ place <router-outlet>

src/app/site-header/site-header.component.ts
→ import RouterLink

src/app/site-header/site-header.component.html
→ create Catalog and Cart routerLink links

src/app/cart/cart.component.ts
→ Cart data

src/app/cart/cart.component.html
→ Cart UI
```

---

## Routing Cheat Sheet

```text
Define routes
→ src/app/app.routes.ts
```

```ts
{
  path: 'catalog',
  component: CatalogComponent
}
```

```text
path
→ URL Angular matches

component
→ component Angular displays
```

```text
Give routes to Angular
→ src/app/app.config.ts
```

```ts
provideRouter(routes)
```

```text
Display routed component
→ src/app/app.html
```

```html
<router-outlet></router-outlet>
```

```text
RouterOutlet
→ placeholder where the matched component appears
```

```text
Navigate to a route
→ site-header.component.html
```

```html
<a routerLink="/catalog">Catalog</a>
<a routerLink="/cart">Cart</a>
```

```text
routerLink
→ lets Angular handle navigation
```

```text
Default route
→ src/app/app.routes.ts
```

```ts
{
  path: '',
  redirectTo: '/catalog',
  pathMatch: 'full'
}
```

### Remember

```text
Route        → WHICH component?
RouterOutlet → WHERE does it appear?
routerLink   → HOW do we navigate?
```
