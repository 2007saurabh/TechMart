/* ---------------------------------------------------------
   Data prep: flatten the nested catalog into one product list,
   then sort it once by price so both query types can use
   binary search instead of scanning every product.
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

const allProducts = flattenProducts(storeData);
const sortedByPrice = [...allProducts].sort((a, b) => a.price - b.price);

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  themeIcon.textContent = isLight ? '☾' : '☀';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.setAttribute('title', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  localStorage.setItem('techmart-theme', isLight ? 'light' : 'dark');
}

setTheme(localStorage.getItem('techmart-theme') || 'dark');
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
});

/* ---------------------------------------------------------
   Binary search helpers over sortedByPrice.
   lowerBound: first index whose price >= target
   upperBound: first index whose price >  target
--------------------------------------------------------- */

function lowerBound(target) {
  let lo = 0, hi = sortedByPrice.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedByPrice[mid].price < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(target) {
  let lo = 0, hi = sortedByPrice.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedByPrice[mid].price <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/* Find the N products with prices closest to target.
   Uses lowerBound to land near the target in O(log n), then
   expands outward with two pointers, O(N) for the N results
   requested — no full-array scan or sort of everything. */
function findClosest(target, count = 6) {
  const n = sortedByPrice.length;
  let right = lowerBound(target);
  let left = right - 1;
  const picked = [];

  while (picked.length < count && (left >= 0 || right < n)) {
    const leftDiff = left >= 0 ? Math.abs(sortedByPrice[left].price - target) : Infinity;
    const rightDiff = right < n ? Math.abs(sortedByPrice[right].price - target) : Infinity;

    if (leftDiff <= rightDiff) {
      picked.push(sortedByPrice[left]);
      left--;
    } else {
      picked.push(sortedByPrice[right]);
      right++;
    }
  }

  return picked.sort((a, b) => Math.abs(a.price - target) - Math.abs(b.price - target));
}

/* Products within [min, max], read straight off the sorted
   slice between two binary-searched boundaries. */
function findInRange(min, max) {
  const start = lowerBound(min);
  const end = upperBound(max);
  return sortedByPrice.slice(start, end);
}

/* ---------------------------------------------------------
   Rendering
--------------------------------------------------------- */

const resultsGrid = document.getElementById('results-grid');
const resultsTitle = document.getElementById('results-title');
const resultsCount = document.getElementById('results-count');

function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function starString(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function productCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  card.innerHTML = `
    ${discount > 0 ? `<span class="badge">${discount}% off</span>` : ''}
    <span class="product-brand">${product.brand}</span>
    <h3 class="product-name">${product.name}</h3>
    <div class="product-price">
      ${formatINR(product.price)}
      ${product.originalPrice > product.price ? `<span class="original">${formatINR(product.originalPrice)}</span>` : ''}
    </div>
    <div class="product-meta">
      <span class="stars">${starString(product.rating)}</span>
      <span>${product.rating} (${product.reviews.toLocaleString('en-IN')})</span>
    </div>
    <span class="stock-note ${product.stock <= 5 ? 'low' : ''}">
      ${product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
    </span>
    <button class="btn-view" type="button">View Product</button>
  `;

  card.querySelector('.btn-view').addEventListener('click', () => openModal(product));
  return card;
}

function renderResults(products, title) {
  resultsTitle.textContent = title;
  resultsGrid.innerHTML = '';

  if (products.length === 0) {
    resultsCount.textContent = '';
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No products match that price. Try a wider range.';
    resultsGrid.appendChild(empty);
    return;
  }

  resultsCount.textContent = `${products.length} product${products.length === 1 ? '' : 's'}`;
  products.forEach(p => resultsGrid.appendChild(productCard(p)));
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
    <span class="product-price">
      ${formatINR(product.price)}
      ${product.originalPrice > product.price ? `<span class="original">${formatINR(product.originalPrice)}</span>` : ''}
    </span>
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
   Tabs
--------------------------------------------------------- */

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.finder-panel').forEach(p => p.classList.remove('is-active'));

    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    document.querySelector(`.finder-panel[data-panel="${btn.dataset.tab}"]`).classList.add('is-active');
  });
});

/* ---------------------------------------------------------
   Nearest-price form
--------------------------------------------------------- */

document.getElementById('nearest-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const target = Number(document.getElementById('target-price').value);
  if (!Number.isFinite(target) || target < 0) return;
  const results = findClosest(target, 6);
  renderResults(results, `Closest to ${formatINR(target)}`);
});

/* ---------------------------------------------------------
   Range form + dual slider
--------------------------------------------------------- */

const minSlider = document.getElementById('min-slider');
const maxSlider = document.getElementById('max-slider');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const sliderFill = document.getElementById('slider-fill');

function syncSliderFill() {
  const sliderMax = Number(minSlider.max);
  const lo = Math.min(Number(minSlider.value), Number(maxSlider.value));
  const hi = Math.max(Number(minSlider.value), Number(maxSlider.value));
  sliderFill.style.left = (lo / sliderMax * 100) + '%';
  sliderFill.style.width = ((hi - lo) / sliderMax * 100) + '%';
}

function syncFromSliders() {
  if (Number(minSlider.value) > Number(maxSlider.value)) {
    [minSlider.value, maxSlider.value] = [maxSlider.value, minSlider.value];
  }
  minPriceInput.value = minSlider.value;
  maxPriceInput.value = maxSlider.value;
  syncSliderFill();
}

function syncFromInputs() {
  const min = Number(minPriceInput.value) || 0;
  const max = Number(maxPriceInput.value) || 0;
  minSlider.value = Math.min(min, Number(minSlider.max));
  maxSlider.value = Math.min(max, Number(maxSlider.max));
  syncSliderFill();
}

minSlider.addEventListener('input', syncFromSliders);
maxSlider.addEventListener('input', syncFromSliders);
minPriceInput.addEventListener('input', syncFromInputs);
maxPriceInput.addEventListener('input', syncFromInputs);

syncFromSliders();

document.getElementById('range-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let min = Number(minPriceInput.value);
  let max = Number(maxPriceInput.value);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return;
  if (min > max) [min, max] = [max, min];
  const results = findInRange(min, max);
  renderResults(results, `Products between ${formatINR(min)} and ${formatINR(max)}`);
});
