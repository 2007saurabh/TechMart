// Simulated Data Store (Viewing history per user)
const userHistories = {
  currentUser: ["Laptop"],
  userA: ["Laptop", "Mouse", "Keyboard", "Headphones"],
  userB: ["Laptop", "Mouse", "Monitor", "Keyboard"],
  userC: ["Laptop", "Monitor", "Desk Pad"]
};

// Target Product being viewed
const currentProduct = "Laptop";

/**
 * 2-Stage Recommendation Engine:
 * Stage 1: Find all users who viewed the target product.
 * Stage 2: Aggregate other products viewed by those users, count frequencies,
 *          exclude items already in active user's history, and pick top 3.
 */
function getTopRecommendations(activeUserId, targetProduct) {
  const activeUserViewed = new Set(userHistories[activeUserId] || []);
  const frequencyMap = {};

  // Step 1: Iterate through all users
  Object.keys(userHistories).forEach((userId) => {
    if (userId === activeUserId) return; // Exclude current user

    const history = userHistories[userId];

    // Check if this user viewed the target product
    if (history.includes(targetProduct)) {
      // Step 2: Aggregate & count other products
      history.forEach((product) => {
        // Exclude the target product itself and any product the user has already viewed
        if (product !== targetProduct && !activeUserViewed.has(product)) {
          frequencyMap[product] = (frequencyMap[product] || 0) + 1;
        }
      });
    }
  });

  // Step 3: Sort by frequency descending
  const sortedProducts = Object.keys(frequencyMap).sort(
    (a, b) => frequencyMap[b] - frequencyMap[a]
  );

  // Step 4: Return Top 3 recommendations
  return sortedProducts.slice(0, 3);
}

/**
 * Render Cards in UI
 */
function renderRecommendations() {
  const userSelect = document.getElementById("user-select");
  const selectedUser = userSelect.value;
  const gridContainer = document.getElementById("recommendation-cards-grid");

  const recommendations = getTopRecommendations(selectedUser, currentProduct);

  // Clear existing content
  gridContainer.innerHTML = "";

  if (recommendations.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        No additional recommendations available for this user.
      </div>
    `;
    return;
  }

  // Render cards
  recommendations.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("recommendation-card");

    card.innerHTML = `
      <h3 class="product-title">${product}</h3>
      <span class="why-label">Often viewed with ${currentProduct}</span>
    `;

    gridContainer.appendChild(card);
  });
}

// Event Listeners
document.getElementById("refresh-btn").addEventListener("click", renderRecommendations);
document.getElementById("user-select").addEventListener("change", renderRecommendations);

// Initial Load
renderRecommendations();