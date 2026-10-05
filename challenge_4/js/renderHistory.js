/* ============================================================
   renderHistory.js — Renders the operation history panel
   ============================================================ */

const RenderHistory = (() => {
  function render() {
    const history = CartState.getHistory();
    const container = document.getElementById('historyList');

    if (!history || history.length === 0) {
      container.innerHTML = `<div class="history-entry">No operations yet</div>`;
      return;
    }

    container.innerHTML = '';

    // Show most recent first
    [...history].reverse().forEach((entry) => {
      const div = document.createElement('div');
      div.className = `history-entry ${entry.undone ? 'undone' : ''}`;
      div.innerHTML = `
        <span class="check">✓</span>
        <span>${entry.text}</span>
      `;
      container.appendChild(div);
    });
  }

  return { render };
})();