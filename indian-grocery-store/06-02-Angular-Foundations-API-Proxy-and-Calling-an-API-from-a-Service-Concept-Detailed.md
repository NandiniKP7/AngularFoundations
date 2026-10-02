# Angular Foundations — API Proxy and Calling an API from a Service

## Topics Covered

1. **Creating an API Proxy**
2. **Calling an API from a Service**

Until now, product data came from a local file:

```text
ProductsService
    ↓
products.json
```

Now we want to move closer to how a real application works:

```text
ProductsService
    ↓
API request
    ↓
Express API
    ↓
product data
```

This introduces two new problems:

```text
1. How can Angular access an API running on another port?

2. How do we keep API data reactive inside Angular?
```

Those are the main ideas in this lesson.

---

# Creating an API Proxy

## What Problem Are We Solving?

Our Angular application runs on:

```text
http://localhost:4200
```

Our Express API runs on:

```text
http://localhost:8081
```

Even though both use `localhost`, the ports are different.

That means the browser treats them as different **origins**.

```text
Angular
localhost:4200

API
localhost:8081

different port
    ↓
different origin
```

Modern browsers protect applications from freely accessing resources on a different origin.

This is where **CORS** becomes relevant.

---

## What Is CORS?

CORS stands for:

```text
Cross-Origin Resource Sharing
```

For this lesson, think of it as:

```text
Browser security
      ↓
App running on one origin
      ↓
tries to access another origin
      ↓
browser may block it
```

Our local setup is:

```text
Angular App
localhost:4200
      ↓
tries to call
      ↓
API
localhost:8081
```

That is a cross-origin request.

---

## Why Use a Proxy?

Instead of having Angular directly call:

```text
http://localhost:8081/api/products
```

we let Angular call:

```text
/api/products
```

Then the Angular development server forwards that request to:

```text
http://localhost:8081/api/products
```

So from the Angular application's point of view:

```text
Angular asks for
/api/products
```

It does not need to know about:

```text
localhost:8081
```

The proxy handles that.

---

## Proxy Mental Model

```text
Angular App
localhost:4200
      ↓
requests
/api/products
      ↓
Angular Dev Proxy
      ↓
forwards request to
localhost:8081/api/products
      ↓
Express API
      ↓
product data
```

The proxy is only helping our **local development setup**.

The course explains that production environments often configure routing differently so the frontend and backend can appear under the same server origin.

---

## Start the API Server

The project already contains an:

```text
api-server/
```

folder.

Open a second terminal.

Move into it:

```bash
cd api-server
```

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The API is now running on:

```text
http://localhost:8081
```

Test:

```text
http://localhost:8081/api/products
```

That endpoint returns the product data.

---

## Create `proxy.conf.json`

Create this file in the **root of the Angular project**:

```text
proxy.conf.json
```

Add:

```json
{
  "/api": {
    "target": "http://localhost:8081"
  }
}
```

Read it like this:

```text
"/api"
→ watch for requests that start with /api

target
→ forward those requests to localhost:8081
```

So:

```text
/api/products
```

becomes:

```text
http://localhost:8081/api/products
```

---

## Tell Angular About the Proxy

**File:**

```text
angular.json
```

Inside the `serve` configuration:

```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  },
  "builder": "@angular/build:dev-server"
}
```

Now Angular knows:

```text
When development server starts
        ↓
load proxy.conf.json
```

Because `angular.json` changed, restart Angular:

```text
Stop server
   ↓
npm start
   ↓
Angular starts with proxy config
```

Now this works:

```text
http://localhost:4200/api/products
```

even though the real API is running on:

```text
http://localhost:8081/api/products
```

That is the proxy doing its job.

---

# Calling an API from a Service

## Why Should the Service Make the API Call?

Before:

```text
ProductsService
      ↓
products.json
```

Now:

```text
ProductsService
      ↓
API
```

The `CatalogComponent` should not care where the data comes from.

It should only ask:

```ts
this.productsService.getProducts()
```

That keeps responsibilities separated.

```text
CatalogComponent
→ display products

ProductsService
→ get products
```

Today:

```text
ProductsService
→ API
```

Previously:

```text
ProductsService
→ products.json
```

The component does not need to change how it thinks about product data.

---

## Enable HTTP Features in Angular

Before Angular can use HTTP tools, the application must provide them.

**File:**

```text
src/app/app.config.ts
```

Import:

```ts
import { provideHttpClient } from '@angular/common/http';
```

Add:

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  provideHttpClient()
]
```

Conceptually:

```text
provideHttpClient()
→ makes Angular HTTP resources available
```

This is application-level configuration.

---

# Understanding `httpResource`

Now we move into:

```text
src/app/products.service.ts
```

The course uses:

```ts
httpResource()
```

to work with the API reactively.

Import:

```ts
import {
  httpResource,
  HttpResourceRef
} from '@angular/common/http';
```

Create:

```ts
private resource: HttpResourceRef<IProduct[] | undefined> =
  httpResource(() => '/api/products');
```

This line contains several ideas.

---

## `httpResource(() => '/api/products')`

```ts
httpResource(() => '/api/products')
```

For this lesson:

```text
httpResource
→ Angular HTTP resource

'/api/products'
→ endpoint we want to use
```

The endpoint goes through our proxy:

```text
/api/products
      ↓
proxy
      ↓
localhost:8081/api/products
```

So the service does not need to write:

```text
http://localhost:8081
```

The proxy hides that local server detail.

---

## What Is the `resource`?

This:

```ts
private resource = httpResource(...)
```

does not directly mean:

```text
resource = product array
```

Instead:

```text
resource
→ HTTP resource object
```

It represents the HTTP request and its reactive state.

The course types it as:

```ts
HttpResourceRef<IProduct[] | undefined>
```

Break that down:

```text
HttpResourceRef
→ HTTP resource object
```

```text
IProduct[]
→ expected API result
```

```text
undefined
→ data may not exist yet
```

That `undefined` matters because an API response is asynchronous.

At first:

```text
request starts
      ↓
data may not be available yet
```

Later:

```text
API responds
      ↓
IProduct[] becomes available
```

---

# Resource Object vs Resource Value

This distinction is important.

```text
this.resource
→ the HTTP resource object
```

```text
this.resource.value()
→ the current data value from that resource
```

Think:

```text
resource
│
└── value()
      ↓
   product data
```

So if the API returned products:

```text
resource.value()
→ [Rajma, Chana, Poha, ...]
```

But while data is not available yet:

```text
resource.value()
→ undefined
```

---

# Why Not Return the Whole Resource?

We could return:

```ts
return this.resource;
```

But then any component using `ProductsService` would need to understand:

```text
HTTP resource details
```

The course wants the service to hide those internal details.

Better separation:

```text
CatalogComponent
→ asks for products

ProductsService
→ handles HTTP details internally
```

The component should not need to know whether the service uses:

```text
JSON file
HTTP resource
API
```

It only needs the product data.

---

# Why Not Return Only `resource.value()`?

We could do:

```ts
return this.resource.value();
```

That gives us:

```text
IProduct[]
```

But the course points out one problem:

```text
raw value
→ not reactive
```

We want reusable service data to stay reactive.

That way:

```text
data changes
      ↓
Angular can react
      ↓
UI stays synchronized
```

So the course wraps the resource value in a **computed signal**.

---

# Understanding `computed()`

The service returns:

```ts
computed(
  () => this.resource.value() ?? []
)
```

Break it down:

```text
computed(...)
→ creates reactive derived data
```

Inside it:

```ts
this.resource.value()
```

means:

```text
get current API value
```

Then:

```ts
?? []
```

means:

```text
if API value is undefined
        ↓
use []
```

So:

```text
API has data
→ return products

API does not have data yet
→ return []
```

That means `getProducts()` never needs to give the component `undefined`.

---

## `?? []` Example

If:

```text
resource.value()
→ undefined
```

then:

```ts
this.resource.value() ?? []
```

becomes:

```text
[]
```

Later:

```text
resource.value()
→ [Rajma, Chana]
```

then:

```ts
this.resource.value() ?? []
```

becomes:

```text
[Rajma, Chana]
```

So the component always receives an array.

---

# Complete `getProducts()`

```ts
getProducts() {
  return computed(
    () => this.resource.value() ?? []
  );
}
```

Read it like this:

```text
resource.value()
→ current API data

?? []
→ fall back to empty array

computed()
→ keep the result reactive
```

Result:

```text
Signal<IProduct[]>
```

---

# Updated `ProductsService`

**File:**

```text
src/app/products.service.ts
```

```ts
import { computed, Injectable } from '@angular/core';
import {
  httpResource,
  HttpResourceRef
} from '@angular/common/http';

import { IProduct } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private resource: HttpResourceRef<IProduct[] | undefined> =
    httpResource(() => '/api/products');

  getProducts() {
    return computed(
      () => this.resource.value() ?? []
    );
  }

}
```

We no longer need:

```ts
import allProducts from './products.json';
```

because product data now comes from the API.

---

# When Does the API Call Happen?

The course explains `httpResource` like this:

```text
create httpResource
→ sets up the resource
```

Then:

```text
resource value is accessed
→ API request occurs
```

After the result is received:

```text
httpResource
→ caches the result
```

So future reads can use the cached value instead of making the same request again.

The important mental model from the course is:

```text
httpResource
→ reactive HTTP access
→ keeps result available
→ caches fetched data
```

---

# Update `CatalogComponent`

Previously:

```ts
products: IProduct[] = [];
```

But `getProducts()` now returns:

```text
Signal<IProduct[]>
```

So the component property must also be a Signal.

**File:**

```text
src/app/catalog/catalog.component.ts
```

Import:

```ts
import { Component, Signal } from '@angular/core';
```

Declare:

```ts
products!: Signal<IProduct[]>;
```

---

## What Does `!` Mean Here?

```ts
products!: Signal<IProduct[]>;
```

The property is not initialized on that line.

But we know it will be assigned later:

```ts
ngOnInit() {
  this.products =
    this.productsService.getProducts();
}
```

The `!` tells TypeScript:

```text
I know this is not initialized here
        ↓
it will be initialized before I use it
```

---

# Why Does the Template Change?

Before:

```html
@for (prod of products; track prod.id)
```

`products` used to be:

```text
IProduct[]
```

Now it is:

```text
Signal<IProduct[]>
```

Signals are read by calling them:

```text
products()
```

So:

```html
@for (prod of products(); track prod.id) {
```

Read it as:

```text
products
→ Signal

products()
→ current array inside the Signal
```

---

# Full Data Flow

```text
CatalogComponent
      ↓
getProducts()
      ↓
computed Signal
      ↓
resource.value()
      ↓
httpResource
      ↓
/api/products
      ↓
Angular dev proxy
      ↓
localhost:8081/api/products
      ↓
Express API
      ↓
product data
      ↓
Signal updates
      ↓
products()
      ↓
@for
      ↓
Catalog UI
```

---

# API + Service Cheat Sheet

```text
Different ports
→ different origins
→ local CORS problem
```

```text
proxy.conf.json
→ forwards /api requests to localhost:8081
```

```ts
provideHttpClient()
```

```text
→ enables Angular HTTP features
```

```ts
httpResource(() => '/api/products')
```

```text
→ sets up reactive access to API data
```

```text
this.resource
→ HTTP resource object
```

```text
this.resource.value()
→ current API data
```

```ts
this.resource.value() ?? []
```

```text
→ API products
→ or [] if value is undefined
```

```ts
computed(
  () => this.resource.value() ?? []
)
```

```text
→ returns reactive product data
```

```ts
products!: Signal<IProduct[]>;
```

```text
→ Catalog now stores a product Signal
```

```html
@for (prod of products(); track prod.id)
```

```text
products()
→ read the Signal value
```
