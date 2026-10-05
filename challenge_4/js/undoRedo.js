/* ============================================================
   undoRedo.js — Undo / Redo action handlers
   ============================================================ */

const UndoRedo = (() => {
  /**
   * Perform an undo:
   *  - If undo stack is empty, do nothing.
   *  - Push current cart to redo stack.
   *  - Pop last snapshot from undo stack and restore it.
   *  - Update history entry flags.
   *  - Re-render.
   */
  function undo() {
    const undoStack = CartState.getUndoStack();
    const redoStack = CartState.getRedoStack();
    if (undoStack.length === 0) return;

    // Save current state to redo
    redoStack.push(CartState.cloneCart(CartState.getCart()));

    // Restore previous state
    const previous = undoStack.pop();
    CartState.restoreCart(previous);

    // Update history flags
    CartState.markLastHistoryUndone();

    // Re-render everything
    RenderCart.render();
    RenderHistory.render();
    updateUndoRedoButtons();
  }

  /**
   * Perform a redo:
   *  - If redo stack is empty, do nothing.
   *  - Push current cart to undo stack.
   *  - Pop last snapshot from redo stack and restore it.
   *  - Update history entry flags.
   *  - Re-render.
   */
  function redo() {
    const undoStack = CartState.getUndoStack();
    const redoStack = CartState.getRedoStack();
    if (redoStack.length === 0) return;

    // Save current state to undo
    undoStack.push(CartState.cloneCart(CartState.getCart()));

    // Restore redo state
    const next = redoStack.pop();
    CartState.restoreCart(next);

    // Update history flags
    CartState.markLastHistoryRedone();

    // Re-render everything
    RenderCart.render();
    RenderHistory.render();
    updateUndoRedoButtons();
  }

  /**
   * Enable / disable the Undo and Redo buttons based on
   * whether their respective stacks are empty.
   */
  function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');

    undoBtn.disabled = CartState.getUndoStack().length === 0;
    redoBtn.disabled = CartState.getRedoStack().length === 0;
  }

  return {
    undo,
    redo,
    updateUndoRedoButtons
  };
})();