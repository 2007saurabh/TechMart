import { getAllProducts } from './recommendationEngine.js';
import { renderRecommendations } from './uiRenderer.js';

// Simulated User Histories mapped to product names present in data_2.js
const userHistories = {
  currentUser: {
    history: ["MacBook Air M3"] // Currently viewing product
  },
  userA: {
    history: ["MacBook Air M3", "Logitech MX Master 3S", "Keychron K2 Mechanical Keyboard", "Sony WH-1000XM5"]
  },
  userB: {
    history: ["MacBook Air M3", "Logitech MX Master 3S", "Razer DeathAdder V3", "Keychron K2 Mechanical Keyboard"]
  },
  userC: {
    history: ["MacBook Air M3", "Razer DeathAdder V3", "Anker 65W GaN Charger"]
  }
};

const currentProduct = "MacBook Air M3";

// Extract products catalog using data loaded from data_2.js
const productsCatalog = getAllProducts(storeData);

function initApp() {
  const userSelect = document.getElementById("user-select");
  const refreshBtn = document.getElementById("refresh-btn");

  // Initial Execution
  renderRecommendations(userSelect.value, currentProduct, userHistories, productsCatalog);

  // Event Listeners
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      renderRecommendations(userSelect.value, currentProduct, userHistories, productsCatalog);
    });
  }

  if (userSelect) {
    userSelect.addEventListener("change", () => {
      renderRecommendations(userSelect.value, currentProduct, userHistories, productsCatalog);
    });
  }
}

// Run app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", initApp);