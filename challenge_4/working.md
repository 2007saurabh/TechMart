# 🛒 Challenge 4 — Undo / Redo Cart

A simple shopping cart with **Undo** and **Redo** functionality, built using pure HTML, CSS, and vanilla JavaScript.

---

## 📌 Features

- ✅ Add product to cart
- ✅ Remove product from cart
- ✅ Increase quantity
- ✅ Decrease quantity
- ✅ Undo last operation
- ✅ Redo undone operation
- ✅ Cart total & item count
- ✅ Operation history log

---

## 🎯 Challenge Goal

Every cart operation should be **reversible** using Undo / Redo.

Example:

```
ADD Laptop
ADD Mouse
REMOVE Mouse
Click UNDO → Mouse returns
Click REDO → Mouse removed again
```

---

## 🧠 Concept Used

- **Two stacks** — one for Undo, one for Redo
- **Snapshot** of cart taken before every operation
- **Deep clone** to avoid reference bugs
- New operation clears the Redo stack

---

## 📁 File Structure

```
techmart-cart/
│
├── index.html
├── css/
│   └── style.css
└── js/
    ├── data.js              → product data
    ├── cartState.js         → central cart state
    ├── undoRedo.js          → undo / redo logic
    ├── cartOperations.js    → add / remove / inc / dec
    ├── renderCatalog.js     → product grid UI
    ├── renderCart.js        → cart UI
    ├── renderHistory.js     → history log UI
    └── main.js              → app bootstrap
```

---

## ▶️ How to Run

1. Download or clone the project folder.
2. Open `index.html` in any modern browser.
3. No server or build step required.

---

## 🕹️ How to Use

| Action | How |
|--------|-----|
| Add item | Click **+ Add** on a product |
| Remove item | Click **✕** on a cart row |
| Increase qty | Click **+** on a cart row |
| Decrease qty | Click **−** on a cart row |
| Undo | Click **↩ Undo** |
| Redo | Click **↪ Redo** |

---

## 🔄 Undo / Redo Flow

```
User action
   ↓
snapshotBeforeChange()   → save current cart to undoStack
   ↓
mutate cart              → add / remove / inc / dec
   ↓
addHistoryEntry()        → log operation
   ↓
render()                 → update UI
```

**Undo:**
- Move current cart → `redoStack`
- Pop from `undoStack` → restore
- Mark history entry as undone

**Redo:**
- Move current cart → `undoStack`
- Pop from `redoStack` → restore
- Un-mark history entry

---

## 🧾 Example Session

| Step | Action | Cart |
|------|--------|------|
| 1 | Add MacBook Air M3 | [MacBook ×1] |
| 2 | Add Sony WH-1000XM5 | [MacBook ×1, Sony ×1] |
| 3 | Remove MacBook | [Sony ×1] |
| 4 | Click **Undo** | [MacBook ×1, Sony ×1] |
| 5 | Click **Redo** | [Sony ×1] |

---

## 📚 Learning Outcome

- Stack-based state management
- Snapshot & restore pattern
- Clean module separation in JS
- Rendering UI from a single source of truth

---

## 🛠️ Tech Stack

- HTML5
- CSS3 (Flexbox + Responsive)
- Vanilla JavaScript (ES6)

---

## 👤 Author

**Your Name**
Challenge 4 — Undo / Redo Cart

---

## 📄 License

Free to use for learning and academic purposes.
