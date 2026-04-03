const CATEGORY_ICONS = {
  Tools: '🔧', Kitchen: '🍳', Garden: '🌱',
  Outdoor: '⛺', Electronics: '💡', Sports: '⚽', Other: '📦'
};

const CATEGORY_CLASS = {
  Tools: 'cat-tools', Kitchen: 'cat-kitchen', Garden: 'cat-garden',
  Outdoor: 'cat-outdoor', Electronics: 'cat-electronics', Sports: 'cat-sports', Other: 'cat-other'
};

let allItems = [];
let searchQuery = '';
let categoryFilter = '';
let availabilityFilter = '';

// ── Fetch & Render ────────────────────────────────────────────────────────────

async function fetchItems() {
  const res = await fetch('/api/items');
  allItems = await res.json();
  renderAll();
}

function filteredItems() {
  return allItems.filter(item => {
    const matchSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery) ||
      item.owner.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery);
    const matchCat = !categoryFilter || item.category === categoryFilter;
    const matchAvail = availabilityFilter === '' ? true :
      item.available === (availabilityFilter === 'true');
    return matchSearch && matchCat && matchAvail;
  });
}

function renderAll() {
  renderStats();
  renderGrid();
}

function renderStats() {
  const total = allItems.length;
  const available = allItems.filter(i => i.available).length;
  const borrowed = total - available;
  document.getElementById('statsBar').innerHTML = `
    <span class="stat-chip">${total} item${total !== 1 ? 's' : ''} listed</span>
    <span class="stat-chip green">${available} available</span>
    ${borrowed > 0 ? `<span class="stat-chip amber">${borrowed} borrowed</span>` : ''}
  `;
}

function renderGrid() {
  const items = filteredItems();
  const grid = document.getElementById('itemsGrid');
  const empty = document.getElementById('emptyState');

  if (items.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = items.map(cardHTML).join('');

  // Attach events
  grid.querySelectorAll('.btn-borrow').forEach(btn => {
    btn.addEventListener('click', () => openBorrowModal(parseInt(btn.dataset.id)));
  });
  grid.querySelectorAll('.btn-return').forEach(btn => {
    btn.addEventListener('click', () => returnItem(parseInt(btn.dataset.id)));
  });
  grid.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteItem(parseInt(btn.dataset.id)));
  });
}

function cardHTML(item) {
  const icon = CATEGORY_ICONS[item.category] || '📦';
  const cls = CATEGORY_CLASS[item.category] || 'cat-other';
  const badge = item.available
    ? '<span class="badge badge-available">Available</span>'
    : '<span class="badge badge-borrowed">Borrowed</span>';
  const borrowedRow = !item.available
    ? `<div class="borrowed-by">Borrowed by: <strong>${escapeHTML(item.borrowedBy)}</strong></div>`
    : '';
  const actionBtn = item.available
    ? `<button class="btn btn-borrow" data-id="${item.id}">Borrow</button>`
    : `<button class="btn btn-return" data-id="${item.id}">Mark as Returned</button>`;

  return `
    <div class="card" data-id="${item.id}">
      <div class="card-top">
        <div class="card-icon ${cls}">${icon}</div>
        <div style="display:flex;align-items:center;gap:.5rem">
          ${badge}
          <button class="btn-delete" data-id="${item.id}" title="Remove listing">🗑</button>
        </div>
      </div>
      <div class="card-body">
        <h3>${escapeHTML(item.name)}</h3>
        ${item.description ? `<p class="description">${escapeHTML(item.description)}</p>` : ''}
        <div class="card-meta">
          <span>📂 ${escapeHTML(item.category)}</span>
          <span>👤 ${escapeHTML(item.owner)}</span>
        </div>
      </div>
      <div class="card-footer">
        ${borrowedRow}
        ${actionBtn}
      </div>
    </div>
  `;
}


// ── API Actions ───────────────────────────────────────────────────────────────

async function addItem(data) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) { const e = await res.json(); showToast(e.error); return; }
  await fetchItems();
  showToast('Item listed!');
}

async function returnItem(id) {
  await fetch(`/api/items/${id}/borrow`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
  await fetchItems();
  showToast('Item marked as returned.');
}

async function borrowItem(id, borrowerName) {
  const res = await fetch(`/api/items/${id}/borrow`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ borrowerName })
  });
  if (!res.ok) { const e = await res.json(); showToast(e.error); return; }
  await fetchItems();
  showToast(`Enjoy it! Remember to return it when done.`);
}

async function deleteItem(id) {
  if (!confirm('Remove this listing?')) return;
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  await fetchItems();
  showToast('Listing removed.');
}

// ── Modals ────────────────────────────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function openBorrowModal(id) {
  const item = allItems.find(i => i.id === id);
  document.getElementById('borrowItemId').value = id;
  document.getElementById('borrowItemName').textContent = `"${item.name}" — listed by ${item.owner}`;
  document.getElementById('borrowerName').value = '';
  openModal('borrowModal');
}

// ── Events ────────────────────────────────────────────────────────────────────

document.getElementById('openAddModal').addEventListener('click', () => openModal('addModal'));

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.getElementById('addItemForm').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  await addItem(Object.fromEntries(fd));
  e.target.reset();
  closeModal('addModal');
});

document.getElementById('borrowForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = parseInt(document.getElementById('borrowItemId').value);
  const name = document.getElementById('borrowerName').value.trim();
  if (!name) return;
  closeModal('borrowModal');
  await borrowItem(id, name);
});

document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase();
  renderGrid();
});

document.getElementById('categoryFilter').addEventListener('change', e => {
  categoryFilter = e.target.value;
  renderGrid();
});

document.getElementById('availabilityFilter').addEventListener('change', e => {
  availabilityFilter = e.target.value;
  renderGrid();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
function showToast(msg) {
  const t = document.querySelector('.toast') || createToast();
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function createToast() {
  const t = document.createElement('div');
  t.className = 'toast';
  document.body.appendChild(t);
  return t;
}

// ── Init ──────────────────────────────────────────────────────────────────────
fetchItems();
