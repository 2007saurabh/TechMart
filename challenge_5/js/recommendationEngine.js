export function getProducts(data) {
  const products = [];
  data.categories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      products.push(...sub.products);
    });
  });
  return products;
}

export function getRecs(uid, target, histories) {
  const seen = new Set(histories[uid]?.history || []);
  const counts = {};

  Object.keys(histories).forEach(id => {
    if (id === uid) return;

    const history = histories[id].history;
    if (history.includes(target)) {
      history.forEach(product => {
        if (product !== target && !seen.has(product)) {
          counts[product] = (counts[product] || 0) + 1;
        }
      });
    }
  });

  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 3);
}
