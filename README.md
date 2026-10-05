# TechMart Challenges

This repository contains multiple front-end challenge projects for the TechMart store. Each challenge is a standalone mini app built with plain HTML, CSS, and JavaScript, and can be opened directly in a browser without a build step.

## Challenge folders

- `chalenge_1` — Smart Price Finder
- `challenge_2` — Popular Products Explorer
- `challenge_4` — Undo / Redo Cart

## How to navigate the project

1. Open the folder for the challenge you want to test.
2. Open that folder's `index.html` (or `popular.html` in challenge 2) in a browser.
3. All related CSS and JavaScript files are linked using relative paths inside the folder.
4. No server setup is required because these are static web pages.

## Challenge 1: Smart Price Finder (`chalenge_1`)

This project helps users search products by price using efficient lookup logic instead of scanning the full catalog each time.

### Files

```text
chalenge_1/
├── index.html
├── style.css
├── app.js
├── data.js
```

### What it does

- Finds products nearest to a target price
- Filters products within a given min–max range
- Uses flattened and sorted product data for faster search
- Uses binary search logic for O(log n) lookups
- Shows product cards and a product details modal

### How it works

- `data.js` contains the TechMart catalog.
- `app.js` flattens categories and products, sorts them by price, and performs search logic.
- `index.html` provides the price form, search tabs, results area, and modal.
- `style.css` provides the dark dashboard styling and responsive layout.

## Challenge 2: Popular Products (`challenge_2`)

This challenge ranks the most popular products based on rating and review count.

### Files

```text
challenge_2/
├── popular.html
├── popular.css
├── popular.js
├── data.js
```

### What it does

- Displays a selected top-N product list
- Ranks items using popularity score
- Shows product cards with rating, reviews, and price details
- Uses a modal popup to view more information

### How it works

- `popular.html` sets up the page layout and modal container.
- `popular.css` contains the product explorer styling.
- `popular.js` loads the product catalog and renders the top results.
- `data.js` provides the product data used by the UI.

## Challenge 4: Undo / Redo Cart (`challenge_4`)

This challenge focuses on cart actions and reversible state management.

### Files

```text
challenge_4/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── cartState.js
│   ├── undoRedo.js
│   ├── cartOperations.js
│   ├── renderCatalog.js
│   ├── renderCart.js
│   ├── renderHistory.js
│   └── main.js
├── working.md
```

### What it does

- Adds products to the cart
- Removes products and adjusts quantity
- Tracks the cart history
- Supports Undo and Redo actions
- Updates totals and the operation log in real time

### How it works

- `index.html` loads the product catalog and cart interface.
- `css/style.css` styles the shopping experience.
- `js/data.js` contains the product list.
- `js/cartState.js` stores the current cart state.
- `js/cartOperations.js` handles add/remove/increment/decrement logic.
- `js/undoRedo.js` manages the undo and redo stacks.
- `js/render*.js` files render the catalog, cart, and history UI.
- `js/main.js` bootstraps the app.
- `working.md` explains the challenge flow and logic in detail.

## General project notes

- Every challenge is built using vanilla JavaScript.
- There is no dependency installation or framework setup.
- The apps are designed to run directly from local files.
- The repository is a collection of static front-end experiments for learning and UI logic practice.

## Quick start

```text
1. Open the desired challenge folder.
2. Open the HTML file in your browser.
3. Interact with the page and test the app.
```

Example:

```text
chalenge_1/index.html
challenge_2/popular.html
challenge_4/index.html
```

This repo is meant to show multiple TechMart challenge implementations in one place, making it easy to explore, compare, and learn from each project.
