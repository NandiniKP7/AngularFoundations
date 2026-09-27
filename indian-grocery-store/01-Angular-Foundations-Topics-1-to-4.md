# Angular Foundations — Topics 1 to 4

These notes cover the first four topics from the Angular Foundations course.

The goal is to keep the notes:

- beginner-friendly
- easy to revise
- focused on the main concept
- detailed enough to understand later
- free from unnecessary repetition

---

# Topic 1 — What Is Angular? An Architectural Overview

Angular is a **component-based framework** for building web applications.

Instead of building an application as one huge page, Angular breaks it into smaller, reusable pieces.

## Angular Architecture

```text
Angular Application
│
├── Components
│   ├── TypeScript → data + behavior
│   ├── HTML       → what appears on screen
│   └── CSS        → styling
│
├── Services
│   → reusable logic, data access, shared state
│
├── Dependency Injection
│   → provides components/services with what they need
│
├── Router
│   → navigation between pages/views
│
└── Change Detection / Signals
    → keeps UI synchronized with changing data
```

## Components

A **component controls one section of the user interface**.

A component usually brings together:

```text
TypeScript → data + behavior
HTML       → UI
CSS        → styling
```

Example:

```text
Indian Grocery Store
│
├── Header Component
├── Product List Component
├── Cart Component
└── Footer Component
```

The important idea:

```text
Data changes in TypeScript
        ↓
Angular notices the change
        ↓
Template updates
        ↓
User sees the new UI
```

## Templates

Angular templates look like normal HTML, but Angular adds special syntax.

Templates can:

- display data
- react to user actions
- bind values
- show or hide content
- repeat content

Think of it as:

```text
HTML
+
Angular syntax
=
Angular Template
```

You will later see syntax like:

```html
{{ value }}
[property]="value"
(event)="method()"
@if (...)
@for (...)
```

You do not need to memorize these yet.

## Standalone Components

Modern Angular applications use **standalone components**.

A standalone component declares the things it depends on, such as:

- another component
- directive
- pipe
- service-related features

The important idea:

```text
Component
   ↓
declares what it needs
```

The actual syntax comes later.

## Services

A **service** is usually a TypeScript class that contains reusable logic.

Typical uses:

- API calls
- shared data
- state management
- reusable business logic

Main difference:

```text
Component
→ UI responsibility

Service
→ reusable logic / state responsibility
```

Example:

```text
Product Component
       ↓
Product Service
       ↓
API / Data
```

## Dependency Injection

Angular can provide a component or service with the dependencies it needs.

```text
Component needs ProductService
        ↓
Angular Dependency Injection
        ↓
ProductService is provided
```

Memory rule:

> A class says what it needs; Angular supplies it.

## Router

The Angular Router connects URLs to application views.

Example:

```text
/products
    ↓
Angular Router
    ↓
Product Component
```

The router manages navigation between pages or views.

## Change Detection and Signals

Angular keeps the UI synchronized with application data.

```text
Data changes
    ↓
Angular detects change
    ↓
UI updates
```

Modern Angular also uses **signals** for reactive state.

For now, just remember:

> A signal represents reactive data that Angular can track.

## Quick Memory

```text
Component = UI building block
Service   = reusable logic
DI        = supplies dependencies
Router    = navigation
Signals   = reactive state
```

### Main Takeaway

> Angular applications are built from components, while services, dependency injection, routing, and reactivity help those components work together.

---

# Topic 2 — Setting Up Your Angular Development Environment

Before building an Angular application, you need a few development tools.

```text
Node.js
   ↓
Angular CLI
   ↓
VS Code
   ↓
Angular Language Service
```

## 1. Node.js

Angular uses **Node.js** during development.

Node allows JavaScript tools to run on your computer outside the browser.

For Angular development, Node is used for things such as:

- running development tools
- running the local development server
- using npm
- installing Angular packages

Installing Node also installs **npm**.

## 2. npm

`npm` stands for Node Package Manager.

It is used to install packages and development tools.

Example:

```bash
npm install
```

Angular projects use npm to install project dependencies.

## 3. Angular CLI

The **Angular CLI** is Angular's command-line tool.

Install it globally with:

```bash
npm install -g @angular/cli
```

### What does `-g` mean?

```text
-g
→ global installation
```

That means Angular CLI commands can be used from different directories on your computer.

The Angular CLI is used for tasks such as:

```text
Create project
Generate components
Run application
Build application
```

## 4. Visual Studio Code

VS Code is the editor used in the course.

Install the **Angular Language Service** extension.

It provides useful Angular editor support such as:

- syntax highlighting
- autocomplete / IntelliSense
- Angular template support
- error detection

## Setup Flow

```text
Install Node.js
      ↓
npm becomes available
      ↓
Install Angular CLI
      ↓
Install VS Code
      ↓
Install Angular Language Service
      ↓
Ready for Angular development
```

## Useful Checks

You can check your installed tools with:

```bash
node --version
npm --version
ng version
```

## Quick Memory

```text
Node.js → runtime for development tools
npm     → installs packages
CLI     → creates and manages Angular projects
VS Code → code editor
Angular Language Service → Angular editor assistance
```

### Main Takeaway

> Node provides the development environment, npm installs packages, and the Angular CLI is the main command-line tool used to create and work with Angular applications.

---

# Topic 3 — Creating and Exploring Our First Angular App

This topic is about understanding **how an Angular application starts and how the first UI appears in the browser**.

For now, focus on this flow:

```text
main.ts
   ↓
starts Angular
   ↓
App component
   ↓
<app-root>
   ↓
app.html
   ↓
Browser shows the UI
```

## 1. Create the Angular Project

Create your project with the Angular CLI:

```bash
ng new indian-grocery-store
```

The CLI:

```text
Creates project files
        ↓
Creates Angular configuration
        ↓
Installs npm dependencies
        ↓
Project is ready
```

Move into the project:

```bash
cd indian-grocery-store
```

Open it in VS Code:

```bash
code .
```

## 2. Run the App

Start the Angular application:

```bash
npm start
```

The development server normally runs at:

```text
http://localhost:4200
```

Development flow:

```text
Edit Angular code
      ↓
Angular rebuilds
      ↓
Browser updates
```

## Important Project Files

```text
indian-grocery-store/
│
└── src/
    │
    ├── index.html
    ├── main.ts
    ├── styles.css
    │
    └── app/
        ├── app.ts
        ├── app.html
        ├── app.css
        └── app.config.ts
```

## `index.html` — Where Angular Appears

Your `index.html` contains:

```html
<body>
  <app-root></app-root>
</body>
```

`<app-root>` is **not a normal HTML element**.

It is the selector for your root Angular component.

Think of it as:

```text
index.html

<app-root>
    ↓
Put the Angular App component here
```

## `app.ts` — Defines the Root Component

Your root component contains:

```ts
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

The key connection is:

```ts
selector: 'app-root'
```

matches:

```html
<app-root></app-root>
```

So:

```text
index.html

<app-root>
    ↓
selector: 'app-root'
    ↓
App component
```

## `app.html` — The Component UI

The root component points to:

```ts
templateUrl: './app.html'
```

That means the visible HTML for the `App` component comes from:

```text
app.html
```

Flow:

```text
<app-root>
    ↓
App component
    ↓
app.html
    ↓
UI appears in browser
```

Example:

```html
<h1>Indian Grocery Store</h1>
```

The browser displays:

```text
Indian Grocery Store
```

## `app.css` — Component Styles

Your component also points to:

```ts
styleUrl: './app.css'
```

So:

```text
App component
│
├── app.html → UI
└── app.css  → styles for this component
```

## `main.ts` — Starts Angular

Your `main.ts` contains:

```ts
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

For now, read this as:

> Start Angular using `App` as the main component.

```text
main.ts
   ↓
bootstrapApplication(...)
   ↓
Angular starts
   ↓
App component loads
```

## `app.config.ts` — Application Configuration

This file contains application-wide Angular configuration.

Your project currently contains configuration for things such as routing.

For now:

```text
app.config.ts
→ application-wide Angular configuration
```

You will learn the details later.

## `styles.css` — Global Styles

`styles.css` contains styles that can apply across the entire application.

```text
styles.css
→ global styles

app.css
→ styles for the App component
```

## The Most Important Connection

```text
main.ts
   ↓
starts Angular
   ↓
App component
   ↓
selector: 'app-root'
   ↓
<app-root> in index.html
   ↓
app.html
   ↓
Indian Grocery Store UI appears
```

## Don't Worry About These Yet

Your code also contains things such as:

```text
signal()
RouterOutlet
provideRouter()
providers
appConfig
```

These are future Angular topics.

For Topic 3, simply recognize that they exist.

## Quick Memory

```text
ng new indian-grocery-store
→ create Angular project

npm start
→ run Angular project

main.ts
→ starts Angular

index.html
→ contains <app-root>

app.ts
→ defines App component

selector: 'app-root'
→ connects App to <app-root>

app.html
→ component UI

app.css
→ component styles

styles.css
→ global styles

app.config.ts
→ application-wide configuration
```

### Main Takeaway

> Angular starts from `main.ts`, loads the `App` component, matches its `app-root` selector with `<app-root>` in `index.html`, and renders the component's `app.html` content in the browser.

---

# Topic 4 — Cloning Our Demo App

Instead of continuing with only the basic app created by the Angular CLI, the course uses a prepared GitHub repository.

The repository contains the Angular project plus additional files that will be used later.

For your project, the same idea applies to **`indian-grocery-store`**.

## Clone the Project

A typical Git flow is:

```bash
git clone <repository-url> indian-grocery-store
```

Then move into the project:

```bash
cd indian-grocery-store
```

## Install Project Dependencies

After cloning a project, run:

```bash
npm install
```

Why?

Because Git repositories normally contain the project source code and `package.json`, but **not the installed `node_modules` folder**.

```text
GitHub repository
      ↓
package.json
      ↓
npm install
      ↓
node_modules
```

So one of the first things you usually do after cloning an Angular project is:

```bash
npm install
```

## Open the Project

Open the current folder in VS Code:

```bash
code .
```

## Extra Files Used by the Course

The prepared course project contains a few extra resources.

### `styles.css`

Contains **global CSS styles** used throughout the application.

```text
styles.css
    ↓
global application styling
```

These are regular CSS styles.

### `public/`

Contains static files such as images.

For your Indian Grocery Store, this could eventually contain:

```text
public/
├── rajma.png
├── kabuli-chana.png
├── soya-chunks.png
├── vermicelli.png
├── peanuts.png
├── toor-dal.png
├── chana-dal.png
├── masoor-dal.png
├── rice.png
└── poha.png
```

These files can later be displayed by Angular components.

### `api-server/`

The course also includes a small **Express.js API server**.

This is separate from the Angular UI.

Conceptually:

```text
Angular App
     ↓
HTTP request
     ↓
Express API
     ↓
Product data
```

For your project, the API can return grocery products such as:

```text
Rajma
Kabuli Chana
Soya Chunks
Vermicelli
Peanuts
Toor Dal
Chana Dal
Masoor Dal
Rice
Poha
```

The API server will be more important later when Angular HTTP concepts are introduced.

### `course-resources/`

This folder contains extra files used later in the course, such as additional CSS.

It is course support material rather than an important Angular concept.

## Cloning vs Creating

There are two common starting situations.

### Create a brand-new Angular project

```bash
ng new indian-grocery-store
```

Angular CLI creates everything from scratch.

### Download an existing project

```bash
git clone <repository-url>
npm install
```

Git downloads the source code, and npm installs the required dependencies.

## Quick Memory

```text
git clone
→ download project source

cd
→ move into project folder

npm install
→ install project dependencies

code .
→ open project in VS Code

styles.css
→ global styles

public/
→ static files/images

api-server/
→ backend API used later
```

### Main Takeaway

> When you clone an existing Angular project, the source code is downloaded from Git, but the npm dependencies still need to be installed locally with `npm install`.
