// 1. Helper function to flatten all products from the nested storeData structure in data.js
function getAllProducts() {
  let allProducts = [];
  storeData.categories.forEach(category => {
    category.subcategories.forEach(subcat => {
      allProducts.push(...subcat.products);
    });
  });
  return allProducts;
}

// Full product catalog extracted from data.js
const productsCatalog = getAllProducts();

// 2. Updated User Histories using actual product names from data.js
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

/**
 * Two-Stage Collaborative Filtering Algorithm:
 * Stage 1: Find all users who viewed the target product.
 * Stage 2: Aggregate other products those users viewed, count frequencies.
 * Stage 3: Exclude products the active user has already viewed/purchased.
 * Stage 4: Return Top 3 items ranked by frequency.
 */
function getTopRecommendations(activeUserId, targetProduct) {
  const activeUserHistory = new Set(userHistories[activeUserId].history);
  const frequencyMap = {};

  // Step 1 & 2: Loop over user histories and calculate frequencies
  Object.keys(userHistories).forEach((userId) => {
    if (userId === activeUserId) return; // Skip active user

    const userHistory = userHistories[userId].history;

    if (userHistory.includes(targetProduct)) {
      userHistory.forEach((productName) => {
        // Exclude target product and items the active user already viewed
        if (productName !== targetProduct && !activeUserHistory.has(productName)) {
          frequencyMap[productName] = (frequencyMap[productName] || 0) + 1;
        }
      });
    }
  });

  // Step 3 & 4: Sort by frequency descending and slice Top 3
  const sortedProducts = Object.keys(frequencyMap).sort(
    (a, b) => frequencyMap[b] - frequencyMap[a]
  );

  return sortedProducts.slice(0, 3);
}

/**
 * Render Recommendations into UI with extra details from data.js (Price, Rating)
 */
function renderRecommendations() {
  const userSelect = document.getElementById("user-select");
  const activeUserId = userSelect.value;
  const gridContainer = document.getElementById("recommendation-grid") || document.getElementById("recommendations-grid");
  
  // Update current product display title in the UI
  const currentProductDisplay = document.getElementById("current-product-name") || document.getElementById("current-product-display");
  if (currentProductDisplay) currentProductDisplay.textContent = currentProduct;

  const recommendations = getTopRecommendations(activeUserId, currentProduct);

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
    // Pull matching product details from storeData via productsCatalog
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

// Event Listeners
document.getElementById("refresh-btn").addEventListener("click", renderRecommendations);
document.getElementById("user-select").addEventListener("change", renderRecommendations);

// Initial Page Load Execution
renderRecommendations();