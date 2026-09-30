/* ---------------------------------------------------------
   Flatten the catalog once.
--------------------------------------------------------- */

function flattenProducts(store) {
  const list = [];
  for (const category of store.categories) {
    for (const sub of category.subcategories) {
      for (const product of sub.products) {
        list.push(product);
      }
    }
  }
  return list;
}

function popularityOf(product) {
  return product.rating * product.reviews;
}

const allProducts = flattenProducts(storeData);

/* ---------------------------------------------------------
   Min-heap, keyed by a comparator. Used to keep only the
   K most popular products in view at any time, rather than
   sorting the whole catalog to read off the top K.

   Why a heap: sorting everything is O(n log n) regardless
   of how small K is. Scanning once while keeping a heap of
   size K costs O(n log k) — each product does one O(log k)
   heap operation, and k stays tiny (3/5/10) even if n grows
   into the millions.
--------------------------------------------------------- */

class MinHeap {
  constructor(compare) {
    this.items = [];
    this.compare = compare; // compare(a, b) < 0 means a sorts before b (a is "smaller")
  }

  size() { return this.items.length; }
  peek() { return this.items[0]; }

  push(item) {
    this.items.push(item);
    this._siftUp(this.items.length - 1);
  }

  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  _siftUp(i) {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.items[i], this.items[parent]) < 0) {
        [this.items[i], this.items[parent]] = [this.items[parent], this.items[i]];
        i = parent;
      } else break;
    }
  }

  _siftDown(i) {
    const n = this.items.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this.compare(this.items[left], this.items[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.items[right], this.items[smallest]) < 0) smallest = right;
      if (smallest === i) break;
      [this.items[i], this.items[smallest]] = [this.items[smallest], this.items[i]];
      i = smallest;
    }
  }
}

/* Return the K products with the highest popularity, without
   sorting the full product list. */
function topKPopular(products, k) {
  const heap = new MinHeap((a, b) => a.popularity - b.popularity);

  for (const product of products) {
    const popularity = popularityOf(product);

    if (heap.size() < k) {
      heap.push({ product, popularity });
    } else if (popularity > heap.peek().popularity) {
      heap.pop();
      heap.push({ product, popularity });
    }
  }

  // Heap only guarantees the *set* of top K, not their order —
  // this final sort is over at most K items, never the full n.
  return heap.items
    .sort((a, b) => b.popularity - a.popularity)
    .map(entry => entry.product);
}

/* ---------------------------------------------------------
   Rendering
--------------------------------------------------------- */

const resultsGrid = document.getElementById('results-grid');
const topkSelect = document.getElementById('topk-select');

function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function starString(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function rankClass(rank) {
  if (rank === 1) return 'top1';
  if (rank === 2) return 'top2';
  if (rank === 3) return 'top3';
  return '';
}

function productCard(product, rank, maxPopularity) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const popularity = popularityOf(product);
  const fillPct = Math.max(6, Math.round((popularity / maxPopularity) * 100));

  card.innerHTML = `
    <span class="rank-badge ${rankClass(rank)}">#${rank}</span>
    <span class="product-brand">${product.brand}</span>
    <h3 class="product-name">${product.name}</h3>
    <div class="rating-row">
      <span class="stars">${starString(product.rating)}</span>
      <span class="rating-value">${product.rating.toFixed(1)}</span>
    </div>
    <span class="review-count">${product.reviews.toLocaleString('en-IN')} reviews</span>
    <div class="popularity-block">
      <div class="popularity-label">
        <span>Popularity</span>
        <span class="popularity-score">${Math.round(popularity).toLocaleString('en-IN')}</span>
      </div>
      <div class="popularity-bar"><div class="popularity-fill" style="width:${fillPct}%"></div></div>
    </div>
    <div class="product-price">${formatINR(product.price)}</div>
    <button class="btn-view" type="button">View Product</button>
  `;

  card.querySelector('.btn-view').addEventListener('click', () => openModal(product));
  return card;
}

function renderTopK(k) {
  const top = topKPopular(allProducts, k);
  const maxPopularity = top.length ? popularityOf(top[0]) : 1;

  resultsGrid.innerHTML = '';
  top.forEach((product, i) => {
    resultsGrid.appendChild(productCard(product, i + 1, maxPopularity));
  });
}

/* ---------------------------------------------------------
   Modal
--------------------------------------------------------- */

const modalBackdrop = document.getElementById('modal-backdrop');
const modalBody = document.getElementById('modal-body');

function openModal(product) {
  const specRows = Object.entries(product.specifications)
    .map(([key, val]) => `<tr><td>${key.replace(/([A-Z])/g, ' $1')}</td><td>${val}</td></tr>`)
    .join('');

  modalBody.innerHTML = `
    <span class="product-brand">${product.brand} · ${product.category} / ${product.subcategory}</span>
    <h3>${product.name}</h3>
    <span class="product-price">${formatINR(product.price)}</span>
    <table class="spec-table">${specRows}</table>
    <div class="tag-row">
      ${product.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}
    </div>
  `;
  modalBackdrop.classList.add('is-open');
}

document.getElementById('modal-close').addEventListener('click', () => {
  modalBackdrop.classList.remove('is-open');
});
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) modalBackdrop.classList.remove('is-open');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modalBackdrop.classList.remove('is-open');
});

/* ---------------------------------------------------------
   Top-K dropdown — re-renders in place, no reload.
--------------------------------------------------------- */

topkSelect.addEventListener('change', () => {
  renderTopK(Number(topkSelect.value));
});

renderTopK(Number(topkSelect.value));
