# Topics 6 & 7 — Creating and Displaying Our First Angular Component

## Topics Covered

1. **What Is an Angular Component?**
2. **Creating Our First Angular Component**
3. **Displaying a Child Component**

This section combines two ideas:

1. **What an Angular component is and how to create one**
2. **How a parent component displays a child component**

For our **Indian Grocery Store**, we created a `CatalogComponent` and displayed it inside the root `App` component.

---

## 1. What Is an Angular Component?

A component controls **one part of the user interface**.

A typical Angular component combines:

```text
Component
│
├── TypeScript
│     → data + behavior
│
├── HTML Template
│     → what appears on screen
│
└── CSS
      → styling
```

For our application:

```text
Indian Grocery Store
│
├── App Component
│
└── Catalog Component
```

The `App` component is the top-level component.

The `CatalogComponent` is a child component displayed inside it.

---

## 2. Creating the Catalog Component

Angular CLI can create the component files for us.

```bash
ng generate component catalog --type=component
```

Short version:

```bash
ng g c catalog --type=component
```

This creates files like:

```text
catalog/
│
├── catalog.component.ts
├── catalog.component.html
├── catalog.component.css
└── catalog.component.spec.ts
```

### What each file does

```text
catalog.component.ts
→ component class + Angular metadata

catalog.component.html
→ component UI

catalog.component.css
→ styles for this component

catalog.component.spec.ts
→ unit tests
```

---

## 3. `@Component` Connects Everything

A component class is connected to Angular through the `@Component` decorator.

Example:

```ts
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {}
```

Think of it as:

```text
CatalogComponent class
        +
@Component metadata
        ↓
Angular Component
```

The important metadata is:

```text
selector
→ name used to display the component

templateUrl
→ HTML file for the component

styleUrl
→ CSS file for the component
```

---

## 4. Your Catalog Template

Your Catalog component currently contains hard-coded product information:

```html
<ul>
  <li>
    <div class="product">
      <div class="details">
        <div>
          <h2>Indian Grocery Store</h2>

          <p>
            Red kidney beans commonly used to prepare rajma curry
            and other Indian dishes
          </p>

          <p>Category Type: Lentils</p>
        </div>
      </div>

      <div class="price">
        <p>$945.00</p>
        <button class="cta">Buy</button>
      </div>
    </div>
  </li>
</ul>
```

For now, this is **static HTML**.

Later we will replace hard-coded values with Angular data.

The learning progression will be:

```text
Hard-coded HTML
      ↓
Component properties
      ↓
Data binding
      ↓
Lists
      ↓
API data
```

So this simple version is only the starting point.

---

## 5. The App Component Is the Parent

Your root component is:

```ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('indian-grocery-store');
}
```

The important part for this topic is:

```ts
imports: [RouterOutlet, CatalogComponent]
```

`CatalogComponent` is added to the parent's `imports`.

That tells Angular:

> The `App` component is allowed to use `CatalogComponent`.

---

## 6. The Child Component Has a Selector

Inside `CatalogComponent`, the selector is:

```ts
selector: 'app-catalog'
```

That creates an Angular element name:

```html
<app-catalog></app-catalog>
```

So:

```text
CatalogComponent
      ↓
selector
      ↓
app-catalog
```

---

## 7. Displaying the Catalog Component

Inside `app.html`:

```html
<app-catalog></app-catalog>
```

Angular sees this selector and renders the Catalog component there.

The important flow is:

```text
App Component
      ↓
imports CatalogComponent
      ↓
app.html
      ↓
<app-catalog>
      ↓
CatalogComponent
      ↓
catalog.component.html
      ↓
Catalog UI appears
```

---

## 8. Why Do We Need Both `imports` and the Selector?

These do two different jobs.

### `imports`

```ts
imports: [CatalogComponent]
```

means:

> The parent knows about this child component.

### Selector

```html
<app-catalog></app-catalog>
```

means:

> Display that child component here.

So:

```text
imports
→ makes component available

selector
→ places component in the UI
```

Both are needed.

---

## 9. Parent and Child Relationship

Because the App component displays the Catalog component:

```text
App Component
     │
     │ parent
     ↓
Catalog Component
      child
```

The component tree currently looks like:

```text
App
└── Catalog
```

Later it may become:

```text
App
└── Catalog
    ├── Product
    ├── Product
    ├── Product
    └── Product
```

This is how Angular applications grow — as a hierarchy of components.

---

## 10. What Does "Standalone Component" Mean Here?

Modern Angular components are standalone.

For this lesson, remember only this:

> A standalone component declares the components and Angular features it wants to use.

Example:

```ts
imports: [CatalogComponent]
```

The `App` component explicitly declares:

```text
"I use CatalogComponent."
```

That makes the dependency visible directly in the component.

---

## 11. What About `RouterOutlet` and `signal()`?

Your `App` currently contains:

```ts
RouterOutlet
```

and:

```ts
signal('indian-grocery-store')
```

You do not need to understand those deeply yet.

They belong to later topics:

```text
RouterOutlet
→ Routing

signal()
→ Angular Signals
```

For Topics 6 and 7, simply recognize that they already exist in the project.

---

## Full Flow in Your Indian Grocery Store

This connects what you learned in Topic 3 with Topics 6 and 7:

```text
main.ts
   ↓
starts Angular
   ↓
App Component
   ↓
app.html
   ↓
<app-catalog>
   ↓
CatalogComponent
   ↓
catalog.component.html
   ↓
Rajma product UI appears
```

That is the key architecture to remember.

---

## Components Cheat Sheet

```bash
ng g c catalog --type=component
```

```text
@Component
→ tells Angular the class is a component

selector
→ HTML-like name used to place the component

templateUrl
→ component HTML

styleUrl
→ component CSS
```

```ts
// Parent component
imports: [CatalogComponent]
```

```html
<!-- Parent template -->
<app-catalog></app-catalog>
```

```text
Parent imports child
        ↓
Parent template uses child's selector
        ↓
Child component appears
```
