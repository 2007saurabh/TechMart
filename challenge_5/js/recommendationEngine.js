// Helper function to flatten all products from the nested storeData structure
export function getAllProducts(storeData) {
  let allProducts = [];
  storeData.categories.forEach(category => {
    category.subcategories.forEach(subcat => {
      allProducts.push(...subcat.products);
    });
  });
  return allProducts;
}

/**
 * Two-Stage Collaborative Filtering Algorithm:
 * Stage 1: Find all users who viewed the target product.
 * Stage 2: Aggregate other products those users viewed, count frequencies.
 * Stage 3: Exclude products the active user has already viewed/purchased.
 * Stage 4: Return Top 3 items ranked by frequency.
 */
export function getTopRecommendations(activeUserId, targetProduct, userHistories) {
  const activeUserHistory = new Set(userHistories[activeUserId]?.history || []);
  const frequencyMap = {};

  Object.keys(userHistories).forEach((userId) => {
    if (userId === activeUserId) return; // Skip active user

    const userHistory = userHistories[userId].history;

    if (userHistory.includes(targetProduct)) {
      userHistory.forEach((productName) => {
        if (productName !== targetProduct && !activeUserHistory.has(productName)) {
          frequencyMap[productName] = (frequencyMap[productName] || 0) + 1;
        }
      });
    }
  });

  const sortedProducts = Object.keys(frequencyMap).sort(
    (a, b) => frequencyMap[b] - frequencyMap[a]
  );

  return sortedProducts.slice(0, 3);
}