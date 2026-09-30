# TechMart — Smart Price Finder (Challenge 1)

A price-search feature for the TechMart product catalog. Users can find products near a target price, or within a min–max range, without scanning the full product list on every search.

## Files

```
index.html   Structure — price finder form, results grid, product modal
style.css    Styling (dark UI, amber/teal accents)
app.js       Data flattening, binary search, rendering, modal, slider logic
data.js      Provided product catalog (unchanged)
```

Open `index.html` in a browser. No build step, no server required — all files are linked with relative paths.

## How it works

**1. Flatten once, sort once.**
`storeData.categories → subcategories → products` is flattened into a single array on load, then sorted by `price` ascending into `sortedByPrice`. This is the only full pass over the data; every search after that works off the sorted array.

**2. Binary search instead of scanning.**
- `lowerBound(target)` — first index with `price >= target`
- `upperBound(target)` — first index with `price > target`

Both are standard O(log n) binary searches over `sortedByPrice`.

**3. Nearest-price search** (`findClosest(target, count)`)
`lowerBound(target)` finds where the target would sit in the sorted array. From that point, two pointers walk outward (left = cheaper, right = pricier), always taking whichever side is closer to the target, until `count` products are collected. Cost: O(log n) to locate the target + O(count) to collect results — never O(n).

**4. Range search** (`findInRange(min, max)`)
`lowerBound(min)` and `upperBound(max)` give the start/end indices directly; the matching products are a single array slice. No filtering pass over the whole catalog.

**5. UI**
- Tabs switch between "Nearest to a price" and "Within a range" without reloading.
- The range tab has a synced dual slider + numeric inputs (dragging the slider updates the number field and vice versa).
- Results render as cards: name, brand, price (with original price struck through if discounted), star rating, review count, stock note, and a "View Product" button.
- "View Product" opens a modal with full specifications and tags.

## Why this matters at scale

Sorting the whole catalog on every keystroke/search would be O(n log n) each time. Here, sorting happens once (O(n log n) total, on load), and every subsequent search is O(log n) or O(log n + k) — the same approach that makes this fast for 22 products keeps it fast for a catalog of a million.
