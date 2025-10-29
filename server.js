const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'columbia-ticket-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});

// Initialize database with default structure
async function initDB() {
  await db.read();
  
  // Initialize empty structure if null
  if (!db.data) {
    db.data = { users: [], tickets: [], transactions: [] };
  }
  
  if (!db.data.users) db.data.users = [];
  if (!db.data.tickets) db.data.tickets = [];
  if (!db.data.transactions) db.data.transactions = [];
  
  // Add demo data if empty
  if (db.data.users.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.data.users.push({
      id: uuidv4(),
      name: 'John Doe',
      email: 'jd1234@columbia.edu',
      password: hashedPassword,
      school: 'CC',
      year: '26',
      rating: 4.8,
      createdAt: new Date().toISOString()
    });
    
    // Add demo user for each ticket seller
    const sellers = [
      { name: 'Sarah Martinez', email: 'sm5678@columbia.edu', school: 'SEAS', year: '26' },
      { name: 'Alex Kim', email: 'ak9012@columbia.edu', school: 'CC', year: '25' },
      { name: 'Mike Rodriguez', email: 'mr3456@columbia.edu', school: 'CC', year: '26' },
      { name: 'Emma Lee', email: 'el7890@columbia.edu', school: 'GS', year: '27' }
    ];
    
    for (const seller of sellers) {
      db.data.users.push({
        id: uuidv4(),
        name: seller.name,
        email: seller.email,
        password: hashedPassword,
        school: seller.school,
        year: seller.year,
        rating: 4.5 + Math.random() * 0.5,
        createdAt: new Date().toISOString()
      });
    }
  }
  
  if (db.data.tickets.length === 0) {
    const userId = db.data.users[0].id;
    const demoTickets = [
      {
        id: uuidv4(),
        title: 'Columbia vs. Yale Football',
        category: 'Sports',
        date: '2025-11-16',
        time: '12:00 PM',
        location: 'Baker Athletics Complex',
        quantity: 2,
        price: 45,
        section: 'Section B, Row 12',
        description: 'Great seats for the big game! Selling because I have a conflict.',
        sellerId: db.data.users[1].id,
        sellerName: 'Sarah M.',
        sellerSchool: 'SEAS \'26',
        status: 'active',
        views: 34,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Varsity Show 2025',
        category: 'Theater',
        date: '2025-04-11',
        time: '8:00 PM',
        location: 'Minor Latham Playhouse',
        quantity: 1,
        price: 30,
        section: 'Orchestra, Row F',
        description: 'Single ticket to this year\'s Varsity Show. Can\'t make it anymore.',
        sellerId: db.data.users[2].id,
        sellerName: 'Alex K.',
        sellerSchool: 'CC \'25',
        status: 'active',
        views: 28,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Spring Formal - Kappa Sigma',
        category: 'Greek Life',
        date: '2025-05-03',
        time: '9:00 PM',
        location: 'Hudson Terrace',
        quantity: 1,
        price: 80,
        section: 'General Admission',
        description: 'Spring formal ticket. Great venue and DJ lineup!',
        sellerId: db.data.users[3].id,
        sellerName: 'Mike R.',
        sellerSchool: 'CC \'26',
        status: 'active',
        views: 19,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Men\'s Basketball vs Princeton',
        category: 'Sports',
        date: '2025-01-21',
        time: '7:00 PM',
        location: 'Levien Gymnasium',
        quantity: 3,
        price: 25,
        section: 'Courtside',
        description: 'Three courtside seats! Amazing view of the game.',
        sellerId: db.data.users[4].id,
        sellerName: 'Emma L.',
        sellerSchool: 'GS \'27',
        status: 'active',
        views: 42,
        createdAt: new Date().toISOString()
      }
    ];
    
    db.data.tickets.push(...demoTickets);
  }
  
  await db.write();
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, school, year } = req.body;
    
    // Validate Columbia email
    if (!email.endsWith('@columbia.edu')) {
      return res.status(400).json({ error: 'Must use Columbia email address' });
    }
    
    await db.read();
    
    // Check if user exists
    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      school,
      year,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    
    db.data.users.push(user);
    await db.write();
    
    // Create token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        school: user.school,
        year: user.year,
        rating: user.rating
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    await db.read();
    
    // Find user
    const user = db.data.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        school: user.school,
        year: user.year,
        rating: user.rating
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Ticket Routes
app.get('/api/tickets', async (req, res) => {
  try {
    await db.read();
    
    let tickets = db.data.tickets.filter(t => t.status === 'active');
    
    // Filter by category
    if (req.query.category && req.query.category !== 'All Events') {
      tickets = tickets.filter(t => t.category === req.query.category);
    }
    
    // Search by query
    if (req.query.search) {
      const searchLower = req.query.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/tickets/:id', async (req, res) => {
  try {
    await db.read();
    
    const ticket = db.data.tickets.find(t => t.id === req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Increment views
    ticket.views = (ticket.views || 0) + 1;
    await db.write();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { title, category, date, time, location, quantity, price, section, description } = req.body;
    
    await db.read();
    
    const user = db.data.users.find(u => u.id === req.user.id);
    
    const ticket = {
      id: uuidv4(),
      title,
      category,
      date,
      time,
      location,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      section,
      description,
      sellerId: req.user.id,
      sellerName: user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0] + '.',
      sellerSchool: `${user.school} '${user.year}`,
      status: 'active',
      views: 0,
      createdAt: new Date().toISOString()
    };
    
    db.data.tickets.push(ticket);
    await db.write();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tickets/:id', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const ticketIndex = db.data.tickets.findIndex(t => t.id === req.params.id);
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const ticket = db.data.tickets[ticketIndex];
    if (ticket.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Update ticket
    Object.assign(ticket, req.body);
    await db.write();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tickets/:id', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const ticketIndex = db.data.tickets.findIndex(t => t.id === req.params.id);
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const ticket = db.data.tickets[ticketIndex];
    if (ticket.sellerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    db.data.tickets.splice(ticketIndex, 1);
    await db.write();
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/my-tickets', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const tickets = db.data.tickets.filter(t => t.sellerId === req.user.id);
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Seller stats
app.get('/api/seller-stats', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const activeListings = db.data.tickets.filter(
      t => t.sellerId === req.user.id && t.status === 'active'
    ).length;
    
    const soldListings = db.data.tickets.filter(
      t => t.sellerId === req.user.id && t.status === 'sold'
    );
    
    const totalRevenue = soldListings.reduce((sum, t) => sum + (t.price * t.quantity), 0);
    
    const user = db.data.users.find(u => u.id === req.user.id);
    
    res.json({
      activeListings,
      ticketsSold: soldListings.length,
      totalRevenue,
      rating: user.rating
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Transaction Routes
app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { ticketId, quantity } = req.body;
    
    await db.read();
    
    const ticket = db.data.tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    if (ticket.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }
    
    // Create transaction
    const transaction = {
      id: uuidv4(),
      ticketId,
      buyerId: req.user.id,
      sellerId: ticket.sellerId,
      quantity,
      price: ticket.price,
      total: ticket.price * quantity,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    
    db.data.transactions.push(transaction);
    
    // Update ticket quantity
    ticket.quantity -= quantity;
    if (ticket.quantity === 0) {
      ticket.status = 'sold';
    }
    
    await db.write();
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Demo credentials: jd1234@columbia.edu / password123');
  });
});
