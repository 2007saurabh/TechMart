/* ============================================================
   cartOperations.js — Add / Remove / Inc / Dec operations
   Each operation:
     1. Snapshots cart (for undo)
     2. Mutates the cart
     3. Adds a history entry
     4. Re-renders
   ============================================================ */

const CartOperations = (() => {
  /**
   * Add a product (quantity += 1, or create new entry).
   */
  function addToCart(productId) {
    const product = CartState.findProduct(productId);
    if (!product) return;

    CartState.snapshotBeforeChange();

    const cart = CartState.getCart();
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }

    CartState.addHistoryEntry(`Added ${product.name}`);

    RenderCart.render();
    RenderHistory.render();
    UndoRedo.updateUndoRedoButtons();
  }

  /**
   * Remove a product entirely from the cart.
   */
  function removeFromCart(productId) {
    const product = CartState.findProduct(productId);
    if (!product) return;

    const cart = CartState.getCart();
    const exists = cart.some((item) => item.productId === productId);
    if (!exists) return;

    CartState.snapshotBeforeChange();

    const index = cart.findIndex((item) => item.productId === productId);
    if (index !== -1) cart.splice(index, 1);

    CartState.addHistoryEntry(`Removed ${product.name}`);

    RenderCart.render();
    RenderHistory.render();
    UndoRedo.updateUndoRedoButtons();
  }

  /**
   * Increase quantity of an existing cart item by 1.
   */
  function increaseQuantity(productId) {
    const product = CartState.findProduct(productId);
    if (!product) return;

    const cart = CartState.getCart();
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    CartState.snapshotBeforeChange();
    item.quantity += 1;

    CartState.addHistoryEntry(`Increased ${product.name} quantity`);

    RenderCart.render();
    RenderHistory.render();
    UndoRedo.updateUndoRedoButtons();
  }

  /**
   * Decrease quantity of an existing cart item by 1.
   * If quantity reaches 0, remove the item.
   */
  function decreaseQuantity(productId) {
    const product = CartState.findProduct(productId);
    if (!product) return;

    const cart = CartState.getCart();
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    CartState.snapshotBeforeChange();

    if (item.quantity > 1) {
      item.quantity -= 1;
      CartState.addHistoryEntry(`Decreased ${product.name} quantity`);
    } else {
      const index = cart.findIndex((i) => i.productId === productId);
      cart.splice(index, 1);
      CartState.addHistoryEntry(`Removed ${product.name}`);
    }

    RenderCart.render();
    RenderHistory.render();
    UndoRedo.updateUndoRedoButtons();
  }

  return {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  };
})();