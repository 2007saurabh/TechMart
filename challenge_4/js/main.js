/* ============================================================
   main.js — App bootstrap. Wires everything together.
   ============================================================ */

(function init() {
  // 1. Render catalog
  RenderCatalog.init();

  // 2. Render cart (empty at first)
  RenderCart.render();

  // 3. Render history (empty at first)
  RenderHistory.render();

  // 4. Wire Undo / Redo buttons
  document
    .getElementById('undoBtn')
    .addEventListener('click', UndoRedo.undo);

  document
    .getElementById('redoBtn')
    .addEventListener('click', UndoRedo.redo);

  // 5. Set initial button state
  UndoRedo.updateUndoRedoButtons();
})();