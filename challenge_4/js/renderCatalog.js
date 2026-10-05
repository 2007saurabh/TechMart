/* ============================================================
   renderCatalog.js — Renders category tabs + product grid
   ============================================================ */

const RenderCatalog = (() => {
  let activeCategoryId = storeData.categories[0].id;

  function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    tabsContainer.innerHTML = '';

    storeData.categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = `category-tab ${
        cat.id === activeCategoryId ? 'active' : ''
      }`;
      btn.textContent = cat.name;
      btn.dataset.categoryId = cat.id;

      btn.addEventListener('click', () => {
        activeCategoryId = cat.id;
        renderCategoryTabs();
        renderProductGrid();
      });

      tabsContainer.appendChild(btn);
    });
  }

  function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    const activeCategory = storeData.categories.find(
      (c) => c.id === activeCategoryId
    );
    if (!activeCategory) return;

    activeCategory.subcategories.forEach((sub) => {
      sub.products.forEach((prod) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-info">
            <div class="product-name">${prod.name}</div>
            <div class="product-meta">
              <span>${prod.brand}</span>
              <span>⭐ ${prod.rating}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center;">
            <span class="product-price">₹${prod.price.toLocaleString('en-IN')}</span>
            <button class="add-btn" data-product-id="${prod.id}">+ Add</button>
          </div>
        `;
        grid.appendChild(card);
      });
    });

    // Attach add-to-cart handlers
    grid.querySelectorAll('.add-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.dataset.productId;
        CartOperations.addToCart(productId);
      });
    });
  }

  function init() {
    renderCategoryTabs();
    renderProductGrid();
  }

  return { init, renderCategoryTabs, renderProductGrid };
})();