const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const seed = {
      items: [
        { id: 1, name: 'Cordless Drill', category: 'Tools', owner: 'Alice (No. 12)', description: 'DeWalt 20V, comes with a bit set.', available: true, borrowedBy: null, createdAt: new Date().toISOString() },
        { id: 2, name: 'Ladder (6ft)', category: 'Tools', owner: 'Bob (No. 7)', description: 'Aluminium step ladder, good condition.', available: true, borrowedBy: null, createdAt: new Date().toISOString() },
        { id: 3, name: 'Cake Tin Set', category: 'Kitchen', owner: 'Maria (No. 3)', description: 'Set of 3 non-stick round tins.', available: false, borrowedBy: 'Sara (No. 9)', createdAt: new Date().toISOString() },
        { id: 4, name: 'Pressure Washer', category: 'Garden', owner: 'Tom (No. 15)', description: 'Karcher K2, great for driveways and patios.', available: true, borrowedBy: null, createdAt: new Date().toISOString() },
        { id: 5, name: 'Tent (4-person)', category: 'Outdoor', owner: 'Jess (No. 21)', description: 'Coleman 4-man dome tent, barely used.', available: true, borrowedBy: null, createdAt: new Date().toISOString() },
      ],
      nextId: 6
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all items
app.get('/api/items', (req, res) => {
  const { category, available } = req.query;
  let { items } = readData();
  if (category) items = items.filter(i => i.category === category);
  if (available !== undefined) items = items.filter(i => i.available === (available === 'true'));
  res.json(items);
});

// POST add new item
app.post('/api/items', (req, res) => {
  const { name, category, owner, description } = req.body;
  if (!name || !category || !owner) {
    return res.status(400).json({ error: 'name, category, and owner are required.' });
  }
  const data = readData();
  const item = {
    id: data.nextId++,
    name: name.trim(),
    category: category.trim(),
    owner: owner.trim(),
    description: (description || '').trim(),
    available: true,
    borrowedBy: null,
    createdAt: new Date().toISOString()
  };
  data.items.push(item);
  writeData(data);
  res.status(201).json(item);
});

// PATCH borrow or return an item
app.patch('/api/items/:id/borrow', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { borrowerName } = req.body;
  const data = readData();
  const item = data.items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found.' });

  if (!item.available) {
    // Return the item
    item.available = true;
    item.borrowedBy = null;
  } else {
    // Borrow the item
    if (!borrowerName) return res.status(400).json({ error: 'borrowerName is required to borrow.' });
    item.available = false;
    item.borrowedBy = borrowerName.trim();
  }
  writeData(data);
  res.json(item);
});

// DELETE remove an item
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = readData();
  const idx = data.items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found.' });
  data.items.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Neighbourhood Borrow Board running at http://localhost:${PORT}`);
});
