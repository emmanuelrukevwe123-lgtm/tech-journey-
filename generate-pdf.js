const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'Neighbourhood-Borrow-Board-Tutorial.pdf');
const doc = new PDFDocument({ margin: 55, size: 'A4', bufferPages: true });
doc.pipe(fs.createWriteStream(OUT));

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  green:      '#2d7a4f',
  greenLight: '#e8f5ee',
  amber:      '#f59e0b',
  gray:       '#4b5563',
  grayLight:  '#f3f4f6',
  code:       '#1e293b',
  codeBg:     '#f8fafc',
  white:      '#ffffff',
  black:      '#111827',
  border:     '#e5e7eb',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const W = doc.page.width - 110; // usable width

function heading1(text) {
  doc.moveDown(0.5)
     .fontSize(22).fillColor(C.green).font('Helvetica-Bold')
     .text(text)
     .moveDown(0.3);
  doc.moveTo(55, doc.y).lineTo(55 + W, doc.y)
     .strokeColor(C.green).lineWidth(1.5).stroke();
  doc.moveDown(0.6);
}

function heading2(text) {
  doc.moveDown(0.6)
     .fontSize(15).fillColor(C.green).font('Helvetica-Bold')
     .text(text)
     .moveDown(0.3);
}

function heading3(text) {
  doc.moveDown(0.4)
     .fontSize(12).fillColor(C.gray).font('Helvetica-Bold')
     .text(text)
     .moveDown(0.2);
}

function body(text) {
  doc.fontSize(10.5).fillColor(C.black).font('Helvetica')
     .text(text, { lineGap: 3 })
     .moveDown(0.4);
}

function note(text) {
  const y = doc.y;
  doc.rect(55, y, W, 1).fill(C.border);
  doc.rect(55, y, 3, 999).fill(C.amber); // drawn over below
  const startY = y + 8;
  doc.fontSize(9.5).fillColor('#92400e').font('Helvetica-Oblique')
     .text('  ' + text, 59, startY, { width: W - 10, lineGap: 2 });
  const endY = doc.y + 6;
  doc.rect(55, y, 3, endY - y).fill(C.amber);
  doc.rect(55, y, W, endY - y).strokeColor(C.border).lineWidth(0.5).stroke();
  doc.y = endY + 8;
}

function codeBlock(lines) {
  const text = Array.isArray(lines) ? lines.join('\n') : lines;
  const padding = 10;
  const startY = doc.y;
  const textHeight = doc.heightOfString(text, {
    font: 'Courier', fontSize: 8.5, width: W - padding * 2
  });
  const boxH = textHeight + padding * 2;

  // guard page break
  if (startY + boxH > doc.page.height - 80) { doc.addPage(); }

  const y = doc.y;
  doc.rect(55, y, W, boxH).fill(C.codeBg).strokeColor(C.border).lineWidth(0.5).stroke();
  doc.fontSize(8.5).fillColor(C.code).font('Courier')
     .text(text, 55 + padding, y + padding, { width: W - padding * 2, lineGap: 2 });
  doc.y = y + boxH + 10;
}

function explainedCode(code, explanation) {
  codeBlock(code);
  body(explanation);
}

function divider() {
  doc.moveDown(0.4)
     .moveTo(55, doc.y).lineTo(55 + W, doc.y)
     .strokeColor(C.border).lineWidth(0.5).stroke()
     .moveDown(0.6);
}

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
doc.rect(0, 0, doc.page.width, doc.page.height).fill(C.green);

doc.fontSize(42).fillColor(C.white).font('Helvetica-Bold')
   .text('Neighbourhood', 55, 180, { align: 'center' });
doc.fontSize(42).fillColor(C.white).font('Helvetica-Bold')
   .text('Borrow Board', { align: 'center' });

doc.moveDown(0.8)
   .fontSize(18).fillColor('#a7d7b8').font('Helvetica')
   .text('A Line-by-Line Tutorial', { align: 'center' });

doc.moveDown(2.5)
   .fontSize(12).fillColor(C.white).font('Helvetica')
   .text('Learn to build a full-stack Node.js web app from scratch', { align: 'center' });

doc.moveDown(0.5)
   .fontSize(10).fillColor('#a7d7b8')
   .text('HTML · CSS · JavaScript · Node.js · Express', { align: 'center' });

doc.rect(55, doc.page.height - 80, W, 0.5).fill('#a7d7b8');
doc.fontSize(9).fillColor('#a7d7b8')
   .text('Written as a teaching guide — every line explained.', 55, doc.page.height - 60, { align: 'center' });

// ─── PAGE 2: TABLE OF CONTENTS ───────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, doc.page.width, 90).fill(C.green);
doc.fontSize(26).fillColor(C.white).font('Helvetica-Bold')
   .text('Table of Contents', 55, 28);

doc.moveDown(1);
const toc = [
  ['1', 'Project Overview & Architecture'],
  ['2', 'package.json — Project Configuration'],
  ['3', 'server.js — The Backend (Express API)'],
  ['    3.1', 'Imports & Setup'],
  ['    3.2', 'Reading & Writing Data'],
  ['    3.3', 'GET /api/items'],
  ['    3.4', 'POST /api/items'],
  ['    3.5', 'PATCH /api/items/:id/borrow'],
  ['    3.6', 'DELETE /api/items/:id'],
  ['    3.7', 'Starting the Server'],
  ['4', 'public/index.html — The Page Structure'],
  ['    4.1', 'Head & Metadata'],
  ['    4.2', 'Header'],
  ['    4.3', 'Controls & Filters'],
  ['    4.4', 'Item Grid'],
  ['    4.5', 'Add Item Modal'],
  ['    4.6', 'Borrow Modal'],
  ['5', 'public/style.css — Styling'],
  ['    5.1', 'CSS Variables & Reset'],
  ['    5.2', 'Header & Buttons'],
  ['    5.3', 'Cards & Grid'],
  ['    5.4', 'Modals & Toasts'],
  ['6', 'public/app.js — Frontend Logic'],
  ['    6.1', 'Constants & State'],
  ['    6.2', 'Fetching & Rendering'],
  ['    6.3', 'API Calls'],
  ['    6.4', 'Modals & Events'],
  ['    6.5', 'Helpers'],
  ['7', 'init.sh — The Bootstrap Script'],
  ['8', 'How It All Fits Together'],
  ['9', 'What to Build Next'],
];

toc.forEach(([num, title]) => {
  const isSection = !num.startsWith(' ');
  doc.fontSize(isSection ? 11 : 10)
     .fillColor(isSection ? C.green : C.gray)
     .font(isSection ? 'Helvetica-Bold' : 'Helvetica')
     .text(`${num.trim()}.  ${title}`, { continued: false });
  doc.moveDown(0.25);
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — Overview
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('1. Project Overview & Architecture');

body(`Welcome! In this tutorial we will walk through every single file of the Neighbourhood Borrow Board — a web app where neighbours can list tools and items for each other to borrow, like a community mini library.`);

body(`By the end you will understand how a real full-stack web application is structured, how the frontend and backend communicate, and how data is stored — all without a database or a complex framework.`);

heading2('What we are building');
body(`A web page that shows item cards. Each card can be in two states: Available or Borrowed. Neighbours can:\n  • Add a new item to the board\n  • Click "Borrow" and enter their name — the item is marked as borrowed\n  • Click "Mark as Returned" when done\n  • Search and filter the board by category or availability\n  • Delete a listing`);

heading2('Technology stack');
body(`Frontend (browser):  HTML, CSS, plain JavaScript — no React, no Vue.\nBackend  (server):   Node.js + Express — handles API requests.\nStorage:             A JSON file (data.json) — no database needed.\nTooling:             npm, a shell script (init.sh).`);

heading2('Architecture diagram');
codeBlock([
  'Browser (public/)             Server (server.js)      Disk',
  '┌─────────────────────┐       ┌──────────────────┐   ┌──────────┐',
  '│ index.html          │  HTTP │                  │   │          │',
  '│ app.js  ──────────────────► │  Express routes  │◄─►│ data.json│',
  '│ style.css           │◄────── │                  │   │          │',
  '└─────────────────────┘       └──────────────────┘   └──────────┘',
]);
body(`The browser loads the HTML/CSS/JS files. When the user does something (adds an item, borrows something), app.js sends an HTTP request to the server. The server reads or writes data.json and sends a JSON response back.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — package.json
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('2. package.json — Project Configuration');

body(`Every Node.js project has a package.json. Think of it as the ID card of your project. It tells Node what your app is called, how to start it, and which libraries it depends on.`);

explainedCode(`{
  "name": "neighboour-hood-borrow-board",
  "version": "1.0.0",
  "main": "server.js",`,
`• name — the project's identifier (lowercase, hyphens only).\n• version — follows Semantic Versioning: major.minor.patch.\n• main — the entry point file. When someone runs "node .", Node looks here.`);

explainedCode(`  "scripts": {
    "start": "node server.js"
  },`,
`Scripts are shortcuts. "npm start" now runs "node server.js" for you. This is a convention — every Node project uses npm start to launch.`);

explainedCode(`  "dependencies": {
    "express": "^5.2.1"
  }`,
`Dependencies are third-party libraries your app needs. The caret (^) means "version 5.2.1 or any compatible newer version". Running npm install downloads these into node_modules/.`);

note('Never commit node_modules/ to git. It can contain thousands of files. Instead, anyone who clones the project runs "npm install" to recreate it from package.json.');

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — server.js
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('3. server.js — The Backend (Express API)');

body(`This is the heart of the server. It receives HTTP requests from the browser, reads or modifies data.json, and sends responses back. Let's go through it block by block.`);

// 3.1
heading2('3.1  Imports & Setup');

explainedCode(`const express = require('express');
const fs      = require('fs');
const path    = require('path');`,
`require() loads a module. Express is the web framework we installed. fs (File System) and path are built into Node.js — no install needed.\n  • express — handles HTTP routing\n  • fs     — reads and writes files on disk\n  • path   — builds file paths safely across Windows/Mac/Linux`);

explainedCode(`const app  = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');`,
`• express() creates the application object. All routes and middleware are attached to "app".\n• PORT is the network port the server will listen on. 3000 is a common development choice.\n• __dirname is a Node built-in that holds the folder where server.js lives. path.join builds the full path to data.json safely regardless of the OS.`);

explainedCode(`app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));`,
`app.use() registers middleware — code that runs on every request before your route handlers.\n  • express.json()   — reads the request body and parses it as JSON, making it available as req.body.\n  • express.static() — serves every file in the public/ folder automatically. This is how the browser gets index.html, style.css, and app.js without us writing individual routes for each.`);

// 3.2
heading2('3.2  Reading & Writing Data');

explainedCode(`function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const seed = { items: [...], nextId: 6 };
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}`,
`This function is our mini database layer. Every time a route needs data, it calls readData().\n  • fs.existsSync() checks if data.json exists yet.\n  • If not, we create it with seed items so the app is not empty on first launch.\n  • JSON.stringify(seed, null, 2) converts the JS object to a formatted JSON string. The "2" adds 2-space indentation so the file is human-readable.\n  • JSON.parse() converts the JSON string back into a JS object when we read the file.\n  • 'utf8' tells Node to read the file as text, not raw bytes.`);

explainedCode(`function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}`,
`writeData() is the save function. It converts the updated JS object back to JSON and overwrites data.json. writeFileSync is synchronous — it completes before the function returns, which keeps our code simple.`);

note(`In a production app with many users you would use a real database (SQLite, PostgreSQL) because writing a whole file on every request would be slow. For a neighbourhood board with a handful of neighbours, this is perfectly fine.`);

// 3.3
heading2('3.3  GET /api/items');

explainedCode(`app.get('/api/items', (req, res) => {
  const { category, available } = req.query;
  let { items } = readData();
  if (category)
    items = items.filter(i => i.category === category);
  if (available !== undefined)
    items = items.filter(i => i.available === (available === 'true'));
  res.json(items);
});`,
`app.get() registers a handler for HTTP GET requests to /api/items.\n  • req.query holds URL query parameters, e.g. ?category=Tools&available=true\n  • We destructure category and available from the query object.\n  • Array.filter() returns a new array containing only items that pass the test.\n  • available comes in as a string ("true"/"false"), so we compare it to the string "true" to get the boolean.\n  • res.json() serialises the array to JSON and sends it with the correct Content-Type header.`);

// 3.4
heading2('3.4  POST /api/items');

explainedCode(`app.post('/api/items', (req, res) => {
  const { name, category, owner, description } = req.body;
  if (!name || !category || !owner) {
    return res.status(400).json({ error: 'name, category, and owner are required.' });
  }`,
`app.post() handles form submissions. req.body is populated by the express.json() middleware we set up earlier. We validate that the required fields exist. res.status(400) sets the HTTP status code to "Bad Request" before sending the error JSON. The return statement stops execution so we don't continue with invalid data.`);

explainedCode(`  const data = readData();
  const item = {
    id: data.nextId++,
    name: name.trim(),
    ...
    available: true,
    borrowedBy: null,
    createdAt: new Date().toISOString()
  };
  data.items.push(item);
  writeData(data);
  res.status(201).json(item);
});`,
`• data.nextId++ uses the stored counter and then increments it, so every item gets a unique ID.\n• .trim() removes leading/trailing whitespace from user input.\n• new Date().toISOString() gives a UTC timestamp like "2026-04-03T18:00:00.000Z".\n• .push() adds the new item to the array.\n• writeData() saves everything back to disk.\n• res.status(201) means "Created" — the correct HTTP code when something new is made.`);

// 3.5
heading2('3.5  PATCH /api/items/:id/borrow');

explainedCode(`app.patch('/api/items/:id/borrow', (req, res) => {
  const id = parseInt(req.params.id, 10);`,
`PATCH means "partially update a resource". The :id part is a URL parameter — Express captures whatever is in that position and puts it in req.params.id as a string. parseInt(value, 10) converts it to a base-10 integer.`);

explainedCode(`  if (!item.available) {
    item.available = true;
    item.borrowedBy = null;
  } else {
    if (!borrowerName) return res.status(400).json(...);
    item.available = false;
    item.borrowedBy = borrowerName.trim();
  }`,
`This single endpoint does double duty — it borrows AND returns.\n  • If the item is already borrowed (not available), we flip it back to available and clear borrowedBy.\n  • If it is available, we mark it as borrowed and record who took it.\nThis pattern is called a "toggle". One endpoint, two behaviours based on current state.`);

// 3.6
heading2('3.6  DELETE /api/items/:id');

explainedCode(`app.delete('/api/items/:id', (req, res) => {
  const idx = data.items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found.' });
  data.items.splice(idx, 1);
  writeData(data);
  res.json({ success: true });
});`,
`• findIndex() returns the position of the matching item, or -1 if not found.\n• -1 means "not found", so we return 404 (Not Found).\n• splice(idx, 1) removes exactly 1 element at position idx — this mutates the array in place.\n• We then save and respond.`);

// 3.7
heading2('3.7  Starting the Server');

explainedCode(`app.listen(PORT, () => {
  console.log(\`Neighbourhood Borrow Board running at http://localhost:\${PORT}\`);
});`,
`app.listen() binds the server to PORT and starts accepting connections. The callback runs once the server is ready. The template literal (\`...\${PORT}...\`) inserts the variable value into the string.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — index.html
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('4. public/index.html — The Page Structure');

body(`HTML is the skeleton of every web page. It describes structure, not appearance or behaviour. Let's go through each major section.`);

heading2('4.1  Head & Metadata');
explainedCode(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neighbourhood Borrow Board</title>
  <link rel="stylesheet" href="style.css" />
</head>`,
`• <!DOCTYPE html> tells the browser this is modern HTML5.\n• lang="en" helps screen readers and search engines.\n• charset="UTF-8" supports all characters including emoji.\n• The viewport meta tag makes the page scale correctly on mobile phones.\n• <link> loads our stylesheet. The browser fetches style.css from the server (Express serves it from public/).`);

heading2('4.2  Header');
explainedCode(`<header>
  <div class="header-inner">
    <div class="logo">
      <span class="logo-icon">🏘️</span>
      <div>
        <h1>Borrow Board</h1>
        <p class="tagline">Your neighbourhood mini library</p>
      </div>
    </div>
    <button class="btn btn-primary" id="openAddModal">+ List an Item</button>
  </div>
</header>`,
`• <header> is a semantic landmark — screen readers know this is the page header.\n• We use a wrapper div.header-inner to centre the content and limit its max-width via CSS.\n• id="openAddModal" gives the button a unique handle so app.js can attach a click event to it.`);

heading2('4.3  Controls & Filters');
explainedCode(`<input type="text" id="searchInput" placeholder="Search items..." />
<select id="categoryFilter">...</select>
<select id="availabilityFilter">...</select>`,
`These are standard HTML form controls. We don't wrap them in a <form> because we never submit to a server — app.js listens to their "input" and "change" events and filters the displayed cards in real time, without a page reload.`);

heading2('4.4  Item Grid & Stats');
explainedCode(`<div class="stats" id="statsBar"></div>
<div class="grid" id="itemsGrid"></div>
<div class="empty-state" id="emptyState" hidden>...</div>`,
`These divs start empty. app.js populates them dynamically after fetching items from the API. The hidden attribute on emptyState hides it initially — app.js toggles it when the grid has no results.`);

heading2('4.5  Add Item Modal');
explainedCode(`<div class="modal-overlay" id="addModal">
  <div class="modal">
    <form id="addItemForm">
      <input type="text" name="name" required />
      <select name="category" required>...</select>
      ...
    </form>
  </div>
</div>`,
`A modal is a dialog that appears on top of the page. It starts invisible (no .active class). When the user clicks "+ List an Item", app.js adds the .active class and CSS transitions it into view. The required attribute tells the browser to validate the field before allowing form submission.`);

heading2('4.6  Borrow Modal');
explainedCode(`<input type="hidden" id="borrowItemId" />`,
`A hidden input is invisible to the user but stores data. When the user clicks "Borrow" on a card, app.js puts that item's ID into this hidden field so the form submission knows which item is being borrowed.`);

explainedCode(`<script src="app.js"></script>`,
`This is placed at the bottom of <body>. This matters — the browser reads HTML top to bottom. If the script were in <head>, it would run before the DOM elements exist and wouldn't be able to find them.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — style.css
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('5. public/style.css — Styling');

body(`CSS controls how everything looks. Let's walk through the key techniques used.`);

heading2('5.1  CSS Variables & Reset');
explainedCode(`:root {
  --green:      #2d7a4f;
  --green-light:#e8f5ee;
  --radius:     12px;
  --shadow:     0 1px 3px rgba(0,0,0,.10);
}`,
`:root targets the top-level element (the whole page). Variables declared here (--name: value) can be used anywhere in the CSS as var(--name). This means you can change the brand colour in one place and it updates everywhere — much better than copy-pasting the hex code.`);

explainedCode(`*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`,
`The universal selector (*) targets every element. box-sizing: border-box makes width calculations sane — padding and borders are included inside the declared width rather than added on top. Zeroing margin and padding removes browser defaults so we start from a blank slate.`);

heading2('5.2  Header & Buttons');
explainedCode(`.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}`,
`• max-width + margin: 0 auto centres the content on wide screens.\n• display: flex makes children sit side by side.\n• align-items: center vertically centres the logo and button.\n• justify-content: space-between pushes the logo left and button right.`);

explainedCode(`.btn { transition: filter .15s, transform .1s; }
.btn:hover  { filter: brightness(1.08); }
.btn:active { transform: scale(.97); }`,
`Transitions animate the change smoothly over 0.15 seconds. On hover, brightness(1.08) makes the button 8% brighter — a subtle feedback that it's clickable. On click (:active), scale(.97) gives a "press" feel by shrinking it slightly.`);

heading2('5.3  Cards & Grid');
explainedCode(`.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.1rem;
}`,
`CSS Grid's auto-fill + minmax is a responsive layout superpower. It creates as many columns as fit, each at least 280px wide but expanding to fill space (1fr). The grid automatically reflows from 4 columns on a wide screen to 1 column on mobile — with zero media queries.`);

explainedCode(`.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}`,
`On hover, the card lifts 2 pixels upward and casts a deeper shadow. Combined with transition on the .card rule, this creates a smooth "lift" animation that signals the card is interactive.`);

heading2('5.4  Modals & Toasts');
explainedCode(`.modal-overlay {
  position: fixed;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
}
.modal-overlay.active {
  opacity: 1;
  pointer-events: all;
}`,
`• position: fixed + inset: 0 stretches the overlay to cover the entire viewport regardless of scroll position.\n• opacity: 0 + pointer-events: none makes it invisible and unclickable (clicks pass through).\n• When app.js adds the .active class, opacity becomes 1 and clicks are re-enabled.\n• transition: opacity .2s fades it in smoothly.`);

explainedCode(`.toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
  transition: opacity .25s, transform .25s;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}`,
`The toast notification sits at the bottom-centre. left: 50% + translateX(-50%) is the classic CSS horizontal-centring trick for fixed elements. translateY(20px) starts it 20px lower; when .show is added, it slides up to its natural position while fading in.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — app.js
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('6. public/app.js — Frontend Logic');

body(`app.js is the brain of the browser side. It fetches data, builds the UI, and wires up all the interactions. No libraries — just plain JavaScript.`);

heading2('6.1  Constants & State');
explainedCode(`const CATEGORY_ICONS = {
  Tools: '🔧', Kitchen: '🍳', Garden: '🌱', ...
};

let allItems = [];
let searchQuery = '';
let categoryFilter = '';
let availabilityFilter = '';`,
`CATEGORY_ICONS is a lookup object — given a category string, we get an emoji. Using an object is faster and cleaner than a chain of if/else statements.\n\nThe let variables are our "state" — the current truth of what the UI should show. When a filter changes, we update the relevant variable and re-render. This is the same mental model as React's useState, just without the framework.`);

heading2('6.2  Fetching & Rendering');
explainedCode(`async function fetchItems() {
  const res = await fetch('/api/items');
  allItems = await res.json();
  renderAll();
}`,
`fetch() sends an HTTP GET request to our server. It returns a Promise, so we use await to pause until it resolves. res.json() reads the response body and parses it — also async, so we await it too. Then we store the items and render.`);

explainedCode(`function filteredItems() {
  return allItems.filter(item => {
    const matchSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery);
    const matchCat = !categoryFilter || item.category === categoryFilter;
    const matchAvail = availabilityFilter === '' ? true :
      item.available === (availabilityFilter === 'true');
    return matchSearch && matchCat && matchAvail;
  });
}`,
`All filtering happens in the browser — no extra server requests. filter() iterates over allItems and returns a new array of only the items that pass all three checks.\n  • !searchQuery short-circuits: if there's no search, everything matches.\n  • The ternary (? :) for matchAvail handles the "All Items" empty-string case.\nAll three conditions must be true (&&) for an item to appear.`);

explainedCode(`function cardHTML(item) {
  return \`
    <div class="card" data-id="\${item.id}">
      <h3>\${escapeHTML(item.name)}</h3>
      ...
    </div>
  \`;
}`,
`cardHTML() builds the HTML string for one card using a template literal. data-id is a custom data attribute — it stores the item's ID right on the element so event handlers can read it without searching through the allItems array.`);

note(`We always call escapeHTML() on user-supplied text before inserting it into HTML. Without this, a malicious item name like <script>alert('hacked')</script> would execute in every visitor's browser (XSS attack). escapeHTML() replaces < with &lt; etc., making the text safe.`);

heading2('6.3  API Calls');
explainedCode(`async function addItem(data) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) { const e = await res.json(); showToast(e.error); return; }
  await fetchItems();
  showToast('Item listed!');
}`,
`For POST we pass a second argument to fetch() — an options object.\n  • method: 'POST' overrides the default GET.\n  • headers tells the server we are sending JSON.\n  • body is the JSON-stringified data.\n  • res.ok is true for 2xx status codes. If false (e.g. 400 validation error), we show the server's error message and return early.\nAfter success, fetchItems() refreshes the whole list from the server.`);

heading2('6.4  Modals & Events');
explainedCode(`document.getElementById('openAddModal')
  .addEventListener('click', () => openModal('addModal'));

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});`,
`addEventListener attaches a function to run when the event fires. querySelectorAll('[data-close]') selects every element that has a data-close attribute — both the X buttons and Cancel buttons. btn.dataset.close reads the attribute value, which is the modal's ID.`);

explainedCode(`grid.querySelectorAll('.btn-borrow').forEach(btn => {
  btn.addEventListener('click', () => openBorrowModal(parseInt(btn.dataset.id)));
});`,
`We re-attach events after every render because the old card elements are replaced with new HTML. btn.dataset.id reads the data-id attribute we set in cardHTML() — this is how we know which item was clicked.`);

explainedCode(`document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});`,
`Clicking the dark background (outside the modal box) should close the modal. e.target is the element that was actually clicked. We check it equals the overlay itself — not a child element inside the modal — to avoid closing when the user clicks within the form.`);

heading2('6.5  Helpers');
explainedCode(`function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}`,
`replace() with a regex and the g (global) flag replaces every occurrence, not just the first. We convert & first — if we converted < first and then &, we'd double-escape the & in &lt;.`);

explainedCode(`let toastTimer;
function showToast(msg) {
  const t = document.querySelector('.toast') || createToast();
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}`,
`We reuse the same toast element rather than creating a new one each time. clearTimeout() cancels any previous timer — if you trigger two toasts quickly, the second one resets the 3-second countdown. setTimeout() schedules the "hide" action 3000 ms (3 seconds) in the future.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — init.sh
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('7. init.sh — The Bootstrap Script');

body(`init.sh is a Bash shell script. It automates the steps a new developer (or you returning after a break) needs to run to get the project going.`);

explainedCode(`#!/bin/bash`,
`The shebang line. The # at the start makes it a comment in Bash, but #! followed by a path is special — it tells the operating system which interpreter to use when this file is executed directly. /bin/bash means "run this with the Bash shell".`);

explainedCode(`set -e`,
`If any command in the script fails (exits with a non-zero code), stop immediately. Without this, the script would continue even after an error, potentially causing confusing failures later.`);

explainedCode(`PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"`,
`$0 is the path to the script itself. dirname strips the filename leaving just the folder. We cd into it and then pwd prints the absolute path — together this gives us the project directory no matter where the user runs the script from. We then cd into it so all subsequent commands work correctly.`);

explainedCode(`if [ ! -d "node_modules" ]; then
  npm install
fi`,
`[ ! -d "node_modules" ] tests whether the directory does NOT exist. If it doesn't, we run npm install. This is the "first run" check — on subsequent runs the folder exists and we skip the install, making startup faster.`);

explainedCode(`node server.js`,
`The final command starts the server. Because of set -e, we only reach this line if everything above succeeded.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — How it all fits together
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('8. How It All Fits Together');

body(`Let's trace the full journey of two user actions to cement your understanding.`);

heading2('User adds a new item');
codeBlock([
  '1. User clicks "+ List an Item"',
  '   → app.js: openModal("addModal")  → CSS adds .active → modal fades in',
  '',
  '2. User fills the form and clicks "Add Item"',
  '   → form "submit" event fires in app.js',
  '   → addItem({ name, category, owner, description })',
  '',
  '3. fetch() sends POST /api/items with JSON body',
  '   → server.js: app.post handler runs',
  '   → validates fields',
  '   → creates item object with new ID',
  '   → pushes to data.items, saves data.json',
  '   → responds with 201 + the new item as JSON',
  '',
  '4. Back in the browser: res.ok is true',
  '   → fetchItems() re-fetches GET /api/items',
  '   → server reads data.json (now includes the new item)',
  '   → returns full list as JSON',
  '   → renderAll() rebuilds the grid with the new card',
  "   → showToast('Item listed!')",
]);

heading2('User borrows an item');
codeBlock([
  '1. User clicks "Borrow" on a card',
  '   → click event on .btn-borrow reads data-id from the element',
  '   → openBorrowModal(id) fills the hidden input + item name label',
  '   → modal opens',
  '',
  '2. User types their name and submits',
  '   → borrowForm "submit" event fires',
  '   → borrowItem(id, borrowerName)',
  '',
  '3. fetch() sends PATCH /api/items/4/borrow  { borrowerName: "Sara" }',
  '   → server finds item with id 4',
  '   → item.available is true → enters the "borrow" branch',
  '   → item.available = false, item.borrowedBy = "Sara"',
  '   → saves data.json, responds with updated item',
  '',
  '4. fetchItems() refreshes → card re-renders with "Borrowed" badge',
  '   and "Mark as Returned" button',
]);

divider();

body(`Notice the pattern: every user action follows the same loop —\n  User gesture → JS event → fetch to server → server reads/writes file → JSON response → re-render.\n\nOnce you understand this loop, you can build almost any CRUD application.`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — What to build next
// ═══════════════════════════════════════════════════════════════════════════════
doc.addPage();
heading1('9. What to Build Next');

body(`You now understand every line. Here are graded challenges to take your skills further:`);

heading2('Beginner');
body(`• Add an "All" option to the category filter in the HTML.\n• Change the server port from 3000 to an environment variable: process.env.PORT || 3000.\n• Add a "date listed" label to each card using item.createdAt.`);

heading2('Intermediate');
body(`• Add edit functionality: a PATCH /api/items/:id route that updates name/description, and an edit modal in the frontend.\n• Add a due-date field: when borrowing, the user picks a return date. Highlight overdue items in red.\n• Persist data with SQLite instead of JSON (use the better-sqlite3 package).`);

heading2('Advanced');
body(`• Add simple authentication: a PIN per household stored in a config file. Only the owner can delete their own listings.\n• Turn the app into a Progressive Web App (PWA) so it works offline and can be "installed" on a phone.\n• Add real-time updates with WebSockets (ws package) so the board refreshes for all neighbours when someone adds or borrows an item.`);

divider();

doc.fontSize(13).fillColor(C.green).font('Helvetica-Bold')
   .text('Congratulations!', { align: 'center' });
doc.moveDown(0.4);
body(`You have read through and understood a complete, working, full-stack web application. Every pattern used here — REST APIs, middleware, JSON storage, DOM manipulation, CSS transitions, modals, and XSS protection — appears in professional codebases every day. Keep building!`);

// ─── Page numbers ─────────────────────────────────────────────────────────────
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  if (i === 0) continue; // no page number on cover
  doc.fontSize(8).fillColor(C.gray).font('Helvetica')
     .text(
       `Neighbourhood Borrow Board Tutorial  •  Page ${i} of ${totalPages - 1}`,
       55, doc.page.height - 35,
       { width: W, align: 'center' }
     );
}

doc.end();
console.log(`PDF written to: ${OUT}`);
