import { getTopRecommendations } from './recommendationEngine.js';

/**
 * Render Recommendations into UI with extra details from data_2.js (Price, Rating)
 */
export function renderRecommendations(activeUserId, currentProduct, userHistories, productsCatalog) {
  const gridContainer = document.getElementById("recommendation-grid") || document.getElementById("recommendations-grid");
  
  // Update current product display title in the UI
  const currentProductDisplay = document.getElementById("current-product-name") || document.getElementById("current-product-display");
  if (currentProductDisplay) currentProductDisplay.textContent = currentProduct;

  const recommendations = getTopRecommendations(activeUserId, currentProduct, userHistories);

  if (!gridContainer) return;
  gridContainer.innerHTML = "";

  if (recommendations.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        No new recommendations available for this user.
      </div>
    `;
    return;
  }

  // Render recommendation cards
  recommendations.forEach((productName) => {
    const productObj = productsCatalog.find(p => p.name === productName);
    
    const card = document.createElement("div");
    card.classList.add("recommendation-card");

    card.innerHTML = `
      <div>
        <h3 class="product-title">${productName}</h3>
        ${productObj ? `<p style="font-size: 0.85rem; color: #4b5563; margin-bottom: 0.5rem;">₹${productObj.price.toLocaleString()} | ⭐ ${productObj.rating}</p>` : ''}
      </div>
      <div class="why-label">Often viewed with ${currentProduct}</div>
    `;

    gridContainer.appendChild(card);
  });
}