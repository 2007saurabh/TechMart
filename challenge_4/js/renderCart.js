/* ============================================================
   renderCart.js — Renders cart items + totals + count badge
   ============================================================ */

const RenderCart = (() => {
  function render() {
    const cart = CartState.getCart();
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grandTotal');
    const countEl = document.getElementById('cartItemCount');

    container.innerHTML = '';

    // Empty cart state
    if (cart.length === 0) {
      container.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
      subtotalEl.textContent = '₹0';
      grandTotalEl.textContent = '₹0';
      countEl.textContent = '0 items';
      return;
    }

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach((item) => {
      const product = CartState.findProduct(item.productId);
      if (!product) return;

      totalItems += item.quantity;
      subtotal += product.price * item.quantity;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">
            ₹${product.price.toLocaleString('en-IN')} × ${item.quantity}
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button class="dec-btn" data-product-id="${product.id}" title="Decrease">−</button>
            <span>${item.quantity}</span>
            <button class="inc-btn" data-product-id="${product.id}" title="Increase">+</button>
          </div>
          <button class="remove-btn" data-product-id="${product.id}" title="Remove">✕</button>
        </div>
      `;
      container.appendChild(row);
    });

    // Attach qty / remove handlers
    container.querySelectorAll('.inc-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        CartOperations.increaseQuantity(e.currentTarget.dataset.productId);
      });
    });

    container.querySelectorAll('.dec-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        CartOperations.decreaseQuantity(e.currentTarget.dataset.productId);
      });
    });

    container.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        CartOperations.removeFromCart(e.currentTarget.dataset.productId);
      });
    });

    // Update totals
    subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    grandTotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    countEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }

  return { render };
})();