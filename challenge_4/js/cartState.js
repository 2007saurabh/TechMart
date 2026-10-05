/* ============================================================
   cartState.js — Central cart state + utilities
   ============================================================ */

const CartState = (() => {
  // The live cart: [{ productId, quantity }]
  let cart = [];

  // Undo / redo stacks of cart snapshots
  let undoStack = [];
  let redoStack = [];

  // Operation history for display
  // each entry: { id, text, undone }
  let operationHistory = [];

  // ---------- Getters ----------
  const getCart = () => cart;
  const getUndoStack = () => undoStack;
  const getRedoStack = () => redoStack;
  const getHistory = () => operationHistory;

  // ---------- Helpers ----------
  const cloneCart = (c) => c.map((item) => ({ ...item }));

  const findProduct = (productId) =>
    allProducts.find((p) => p.id === productId);

  // ---------- Mutations ----------
  /**
   * Take a snapshot of the current cart and push to undo stack.
   * Call this BEFORE mutating the cart.
   */
  function snapshotBeforeChange() {
    undoStack.push(cloneCart(cart));
    // A new operation invalidates any redo history
    redoStack = [];
  }

  /**
   * Replace the live cart with a given snapshot.
   * (Used by undo / redo)
   */
  function restoreCart(snapshot) {
    cart = cloneCart(snapshot);
  }

  /**
   * Push a new history entry.
   */
  function addHistoryEntry(text) {
    operationHistory.push({
      id: Date.now() + Math.random(),
      text,
      undone: false
    });
  }

  /**
   * Mark the most recent non-undone history entry as undone.
   * (Used during undo.)
   */
  function markLastHistoryUndone() {
    for (let i = operationHistory.length - 1; i >= 0; i--) {
      if (!operationHistory[i].undone) {
        operationHistory[i].undone = true;
        return;
      }
    }
  }

  /**
   * Mark the most recent undone history entry as active again.
   * (Used during redo.)
   */
  function markLastHistoryRedone() {
    for (let i = operationHistory.length - 1; i >= 0; i--) {
      if (operationHistory[i].undone) {
        operationHistory[i].undone = false;
        return;
      }
    }
  }

  /**
   * Clear history (used when a new operation happens after undo).
   * Actually we don't clear — we just append. The undone flags
   * remain, but visually a fresh entry is added.
   */

  // ---------- Public API ----------
  return {
    getCart,
    getUndoStack,
    getRedoStack,
    getHistory,
    findProduct,
    snapshotBeforeChange,
    restoreCart,
    addHistoryEntry,
    markLastHistoryUndone,
    markLastHistoryRedone,
    cloneCart
  };
})();