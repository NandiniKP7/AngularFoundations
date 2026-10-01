# Topic 5 — Introduction to TypeScript

## Topics Covered

1. **Static Typing**
2. **Interfaces and Optional Properties**
3. **Class Properties**
4. **Public and Private**
5. **Constructor Shorthand**

Angular uses **TypeScript** as its main programming language.

TypeScript is JavaScript with extra features that help catch mistakes while you are writing code.

For this course, you mainly need to understand four TypeScript ideas:

```text
TypeScript
│
├── Static Types
├── Interfaces
├── Class Properties
└── Public / Private
```

---

## 1. Static Typing

JavaScript allows a variable to change to a completely different type.

```js
let price = 4.99;

price = "four dollars";
```

TypeScript lets us say what type of value a variable should contain.

```ts
let price: number = 4.99;
let productName: string = "Rajma";
let available: boolean = true;
```

Now this would be an error:

```ts
price = "four dollars";
```

because `price` is supposed to contain a number.

```text
price
  ↓
expects number
  ↓
"four dollars"
  ✕
string is not allowed
```

### Basic Syntax

```text
variableName: type
```

Examples:

```ts
let quantity: number = 2;
let category: string = "Lentils";
let inStock: boolean = true;
```

#### Why this matters

TypeScript can catch many mistakes **before the application runs**.

> Types tell TypeScript what kind of value is allowed.

---

## 2. Interfaces — Describe an Object's Shape

A grocery product has several related values:

```text
Product
│
├── name
├── price
└── category
```

An interface lets us describe what a valid product should look like.

```ts
interface Product {
  name: string;
  price: number;
  category: string;
}
```

Now we can create an object of type `Product`:

```ts
const rajma: Product = {
  name: "Rajma",
  price: 4.99,
  category: "Beans"
};
```

TypeScript checks that the object follows the interface.

---

### What if the type is wrong?

```ts
const rajma: Product = {
  name: "Rajma",
  price: "4.99",
  category: "Beans"
};
```

This fails because:

```text
price
  ↓
should be number
  ↓
received string
```

---

### What if a required property is missing?

```ts
const rajma: Product = {
  name: "Rajma",
  price: 4.99
};
```

This fails because `category` is required.

---

## Optional Properties — `?`

Sometimes a property does not always need to exist.

For example, not every grocery product may have a discount.

```ts
interface Product {
  name: string;
  price: number;
  discount?: number;
}
```

The `?` means:

> This property is optional.

Both are valid:

```ts
const rajma: Product = {
  name: "Rajma",
  price: 4.99
};
```

and:

```ts
const rice: Product = {
  name: "Rice",
  price: 12.99,
  discount: 0.1
};
```

Remember:

```text
discount: number
→ required

discount?: number
→ optional
```

---

## 3. Class Properties

Angular components and services are TypeScript classes, so class properties are important.

Example:

```ts
class Product {
  name: string;
  price: number;
}
```

Here, `name` and `price` are properties that belong to the class.

```text
Product
│
├── name
└── price
```

We can initialize them through a constructor.

```ts
class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}
```

Create an object:

```ts
const rajma = new Product("Rajma", 4.99);
```

Now:

```text
rajma.name  → "Rajma"
rajma.price → 4.99
```

---

## 4. Public and Private

Class members can control where they are accessible.

The two access levels introduced in this lesson are:

```text
public
private
```

---

### `public`

Class members are **public by default**.

```ts
class Product {
  name = "Rajma";
}
```

Code outside the class can access the property:

```ts
const product = new Product();

console.log(product.name);
```

You could explicitly write:

```ts
class Product {
  public name = "Rajma";
}
```

but `public` is optional because it is already the default.

```text
public
→ usable inside the class
→ usable outside the class
```

---

### `private`

A private member can only be accessed from inside its class.

```ts
class Product {
  private costPrice = 2.50;

  calculateProfit() {
    return 4.99 - this.costPrice;
  }
}
```

Inside the class:

```text
this.costPrice
✓ allowed
```

Outside the class:

```ts
const product = new Product();

product.costPrice;
```

TypeScript reports an error.

```text
private
   ↓
inside class  ✓
outside class ✕
```

---

## 5. Constructor Shorthand

This is one of the most useful TypeScript shortcuts in the lesson.

### Longer version

```ts
class Product {
  private name: string;
  private category: string;

  constructor(name: string, category: string) {
    this.name = name;
    this.category = category;
  }
}
```

We:

1. declare the properties
2. receive constructor parameters
3. assign the parameters to the properties

---

### TypeScript shorthand

TypeScript lets us shorten all of that to:

```ts
class Product {
  constructor(
    private name: string,
    private category: string
  ) {}
}
```

These two approaches accomplish the same basic thing.

```text
constructor(private name: string)
            ↓
creates property
            +
receives value
            +
assigns value
```

So this:

```ts
constructor(private name: string) {}
```

is roughly equivalent to:

```ts
private name: string;

constructor(name: string) {
  this.name = name;
}
```

---

### Important: What Does `private` Mean Here?

This:

```ts
constructor(private name: string) {}
```

does **not** mean you cannot pass a value into the constructor.

You can still write:

```ts
const rajma = new Product("Rajma", "Beans");
```

`private` controls access to the property **after the object is created**.

---

## Putting the Ideas Together

```ts
interface GroceryItem {
  name: string;
  category: string;
  discount?: number;
}

class Product {
  constructor(
    public name: string,
    public price: number,
    private costPrice: number
  ) {}

  calculateProfit(): number {
    return this.price - this.costPrice;
  }
}
```

What do we have here?

```text
name
→ string
→ public

price
→ number
→ public

costPrice
→ number
→ private

discount?
→ optional property

calculateProfit()
→ returns a number
```

---

## Why This Matters in Angular

Angular components and services are TypeScript classes.

So later you will often see code like:

```ts
export class ProductList {
  title: string = "Indian Grocery Store";
}
```

or constructor parameters such as:

```ts
constructor(private productService: ProductService) {}
```

You do not need to understand Angular services yet.

For now, just recognize the TypeScript pattern:

```text
private productService
→ creates a private class property
→ initialized through the constructor
```

---

## TypeScript Cheat Sheet

```ts
let price: number = 4.99;
let name: string = 'Rajma';
let available: boolean = true;
```

```ts
interface Product {
  name: string;
  price: number;
  discount?: number;
}
```

```text
property: type   → required property
property?: type  → optional property
public           → accessible inside and outside the class
private          → accessible only inside the class
```

```ts
constructor(
  public name: string,
  private costPrice: number
) {}
```

```text
constructor(public/private ...)
→ creates + receives + initializes the class property
```
