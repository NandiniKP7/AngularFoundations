# Angular Foundations — Services and Dependency Injection

## Topics Covered

1. **What Are Angular Services?**
2. **Creating an Angular Service**
3. **Injecting and Using an Angular Service**

This section introduces the final major architectural piece of an Angular application: **services**.

Until now, our `CatalogComponent` was responsible for getting its product data directly from:

```text
products.json
```

That works, but as an application grows, we do not want every component to contain its own logic for finding, loading, or updating product data.

Angular services help us separate that responsibility.

---

## What Are Angular Services?

An Angular service is simply a **TypeScript class** that we use to perform some action or store data.

For example:

```text
ProductsService
      ↓
getProducts()
      ↓
returns product data
```

A service could eventually contain logic for things such as:

```text
fetching products
updating products
creating products
sharing data
calling an API
```

The basic idea is simple:

```text
Component
→ focuses on the UI

Service
→ focuses on reusable logic / data
```

---

### Why Do We Need Services?

Technically, we could put all of our logic directly inside components.

But imagine several components all needing product data.

Without a service:

```text
CatalogComponent
→ knows how to get products

CartComponent
→ knows how to get products

AnotherComponent
→ knows how to get products
```

Now the same data-access logic is duplicated across the application.

With a service:

```text
              ProductsService
                   ↓
             getProducts()
              ↙         ↘
CatalogComponent       Other Components
```

The product-fetching logic lives in one place.

---

### Code Reuse

A service lets us write product logic once and reuse it.

Instead of every component knowing:

```text
Where are products stored?
How do I fetch them?
Which API URL should I call?
```

the component can simply ask:

```ts
this.productsService.getProducts()
```

If we later change where the products come from:

```text
Today
products.json

Later
API
```

we only need to change the logic inside the service.

The components can continue calling:

```ts
getProducts()
```

---

### Separation of Concerns

Our `CatalogComponent` should mainly care about displaying products.

```text
CatalogComponent
│
├── display products
├── respond to clicks
└── manage Catalog UI
```

It should not also need to know:

```text
API URL
HTTP request details
how product data is retrieved
```

That responsibility can move to:

```text
ProductsService
```

So:

```text
CatalogComponent
→ UI responsibility

ProductsService
→ product data responsibility
```

This keeps each class focused on one job.

---

### Services and Dependency Injection

A service may also need another service.

For example, later a `ProductsService` could use something like an HTTP client to call an API.

Without dependency injection, the service would have to create that dependency itself.

Conceptually:

```text
ProductsService
     ↓
creates HTTP dependency itself
```

With dependency injection:

```text
Angular
   ↓
creates dependency
   ↓
injects it
   ↓
ProductsService uses it
```

The class only asks for what it needs.

This improves separation of concerns and also makes testing easier because a real dependency can be replaced with a fake one during automated tests.

For now, the important idea is:

```text
Dependency Injection
→ Angular gives a class the dependency it needs
```

---

## Creating an Angular Service

Our `CatalogComponent` currently gets products directly from:

```text
products.json
```

We want to move that responsibility into a service.

The goal becomes:

```text
products.json
     ↓
ProductsService
     ↓
CatalogComponent
```

instead of:

```text
products.json
     ↓
CatalogComponent
```

---

### Create the Service

Use the Angular CLI:

```bash
ng g service products --type=service
```

Unlike components, services are not placed into their own folder by default.

A component usually has several files:

```text
component.ts
component.html
component.css
component.spec.ts
```

A service mainly needs:

```text
products.service.ts
products.service.spec.ts
```

Our service file is:

```text
src/app/products.service.ts
```

---

### `@Injectable`

The generated service contains the `@Injectable` decorator.

**File:**

```text
src/app/products.service.ts
```

```ts
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
}
```

For this course, remember:

```text
@Injectable
→ tells Angular this class can participate in dependency injection

providedIn: 'root'
→ makes the service available through Angular's provider system
```

Providers control how Angular creates and supplies service instances.

The deeper details of providers are outside this lesson, so for now the important pattern is:

```ts
@Injectable({
  providedIn: 'root',
})
```

---

### Add `getProducts()`

We want our service to be responsible for retrieving products.

**File:**

```text
src/app/products.service.ts
```

Import the product model:

```ts
import { IProduct } from './product.model';
```

Import the existing JSON data:

```ts
import allProducts from './products.json';
```

Then create:

```ts
getProducts(): IProduct[] {
  return allProducts;
}
```

The complete service is:

```ts
import { Injectable } from '@angular/core';
import { IProduct } from './product.model';
import allProducts from './products.json';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  getProducts(): IProduct[] {
    return allProducts;
  }

}
```

Flow:

```text
products.json
     ↓
ProductsService
     ↓
getProducts()
     ↓
IProduct[]
```

For now, the service reads from JSON.

Later, the inside of `getProducts()` could change to use an API.

The component would not need to know that implementation changed.

---

## Injecting and Using an Angular Service

We now have:

```text
ProductsService
     ↓
getProducts()
```

But our `CatalogComponent` still needs access to that service.

We do that with **constructor injection**.

---

### Inject `ProductsService`

**File:**

```text
src/app/catalog/catalog.component.ts
```

First import the service:

```ts
import { ProductsService } from '../products.service';
```

Then add it to the constructor:

```ts
constructor(private productsService: ProductsService) {
}
```

Read this as:

```text
CatalogComponent needs ProductsService
          ↓
constructor asks for it
          ↓
Angular injects it
          ↓
CatalogComponent can use it
```

The important syntax is:

```ts
private productsService: ProductsService
```

Because the constructor parameter is marked `private`, TypeScript also creates a private class member for us.

So throughout the class we can use:

```ts
this.productsService
```

---

### Why Not Initialize `products` Immediately?

We might first try:

```ts
products = this.productsService.getProducts();
```

But in the course example, that causes a problem because the field initializer runs before the constructor has injected `productsService`.

So instead we first declare:

```ts
products: IProduct[] = [];
```

and then load the data after the component is created.

---

### Load Products in `ngOnInit()`

Our component already learned about the `ngOnInit()` lifecycle hook.

We can use it here:

```ts
ngOnInit() {
  this.products = this.productsService.getProducts();
}
```

Flow:

```text
CatalogComponent created
        ↓
ProductsService injected
        ↓
ngOnInit()
        ↓
getProducts()
        ↓
products[]
        ↓
template renders products
```

---

### Updated `CatalogComponent`

**File:**

```text
src/app/catalog/catalog.component.ts
```

```ts
import { Component } from '@angular/core';

import { ProductDetailsComponent } from '../product-details/product-details.component';

import { ProductsService } from '../products.service';

import { IProduct } from '../product.model';

@Component({
  selector: 'store-catalog',
  imports: [ProductDetailsComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {

  products: IProduct[] = [];

  constructor(private productsService: ProductsService) {
  }

  ngOnInit() {
    this.products = this.productsService.getProducts();
  }

}
```

The important change is that `CatalogComponent` no longer imports:

```ts
allProducts from '../products.json'
```

The component does not need to know where the data comes from anymore.

It only knows:

```ts
this.productsService.getProducts()
```

---

## Before and After

### Before the Service

```text
products.json
     ↓
CatalogComponent
     ↓
products
     ↓
Catalog UI
```

The component knew how to get its own data.

### After the Service

```text
products.json
     ↓
ProductsService
     ↓
getProducts()
     ↓
CatalogComponent
     ↓
products
     ↓
Catalog UI
```

Now responsibilities are separated:

```text
ProductsService
→ gets product data

CatalogComponent
→ displays product data
```

---

## How Everything Connects

```text
products.json
      ↓
ProductsService
      ↓
getProducts()
      ↓
Angular Dependency Injection
      ↓
CatalogComponent constructor
      ↓
ngOnInit()
      ↓
this.products
      ↓
@for in catalog template
      ↓
ProductDetailsComponent
      ↓
Product UI
```

The key architectural improvement is:

```text
CatalogComponent
does NOT care
where products come from
        ↓
it asks ProductsService
        ↓
ProductsService handles that responsibility
```

Later:

```text
products.json
```

can become:

```text
API
```

without moving that responsibility back into the component.

---

## Services Cheat Sheet

```text
Service
→ reusable TypeScript class for logic/data
```

```bash
ng g service products --type=service
```

```ts
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
}
```

```text
@Injectable
→ service can participate in Angular dependency injection
```

```ts
getProducts(): IProduct[] {
  return allProducts;
}
```

```text
Service method
→ hides how product data is retrieved
```

```ts
constructor(private productsService: ProductsService) {
}
```

```text
Constructor injection
→ Angular supplies ProductsService to CatalogComponent
```

```ts
products: IProduct[] = [];

ngOnInit() {
  this.products = this.productsService.getProducts();
}
```

```text
Component
→ asks service for data

Service
→ owns product-data logic
```
