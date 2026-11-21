const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for orders (pre-populated with sample data)
let orders = [
  {
    id: 'JEM-101',
    customerName: 'Amina Kamau',
    phone: '+254 712 345 678',
    pickup: 'Westlands, Nairobi',
    dropoff: 'Kilimani, Nairobi',
    item: 'Electronics Box (2kg)',
    status: 'In Transit',
    createdAt: new Date().toLocaleString()
  },
  {
    id: 'JEM-102',
    customerName: 'David Ochieng',
    phone: '+254 798 765 432',
    pickup: 'CBD, Moi Avenue',
    dropoff: 'Karen Shopping Centre',
    item: 'Legal Documents Envelope',
    status: 'Pending',
    createdAt: new Date().toLocaleString()
  }
];

// Route: Admin Panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route: Download Android APK from resources folder
app.get('/download-app', (req, res) => {
  const apkPath = path.join(__dirname, 'resources', 'app.apk');
  if (fs.existsSync(apkPath)) {
    res.download(apkPath, 'JemmoApp.apk');
  } else {
    res.status(404).send('APK file not found in resources/app.apk. Please upload your JemmoApp build.');
  }
});

// API: Get all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// API: Create a new delivery order
app.post('/api/orders', (req, res) => {
  const { customerName, phone, pickup, dropoff, item } = req.body;
  if (!customerName || !phone || !pickup || !dropoff || !item) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newOrder = {
    id: 'JEM-' + Math.floor(103 + Math.random() * 900),
    customerName,
    phone,
    pickup,
    dropoff,
    item,
    status: 'Pending',
    createdAt: new Date().toLocaleString()
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// API: Update order status
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);

  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  res.json(order);
});

// API: Delete order
app.delete('/api/orders/:id', (req, res) => {
  orders = orders.filter(o => o.id !== req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`JemmoApp server running at http://localhost:${PORT}`);
  console.log(`JemmoApp Admin panel available at http://localhost:${PORT}/admin`);
});

