const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'columbia-ticket-secret-key-change-in-production';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const adapter = new JSONFile('db.json');
const db = new Low(adapter, {});

async function initDB() {
  await db.read();
  
  if (!db.data) {
    db.data = { users: [], tickets: [], transactions: [] };
  }
  
  if (!db.data.users) db.data.users = [];
  if (!db.data.tickets) db.data.tickets = [];
  if (!db.data.transactions) db.data.transactions = [];
  
  if (db.data.users.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const demoUsers = [
      {
        id: uuidv4(),
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        email: 'jd1234@columbia.edu',
        password: hashedPassword,
        program: 'MBA',
        phoneNumber: '212-555-0100',
        paymentMethod: 'Venmo',
        paymentHandle: '@johndoe',
        rating: 4.8,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        firstName: 'Sarah',
        lastName: 'Martinez',
        name: 'Sarah Martinez',
        email: 'sm5678@columbia.edu',
        password: hashedPassword,
        program: 'EMBA',
        phoneNumber: '',
        paymentMethod: 'Venmo',
        paymentHandle: '@sarahm',
        rating: 4.7,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        firstName: 'Alex',
        lastName: 'Kim',
        name: 'Alex Kim',
        email: 'ak9012@columbia.edu',
        password: hashedPassword,
        program: 'MBA',
        phoneNumber: '',
        paymentMethod: 'Zelle',
        paymentHandle: 'alex.kim@email.com',
        rating: 4.9,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        firstName: 'Mike',
        lastName: 'Rodriguez',
        name: 'Mike Rodriguez',
        email: 'mr3456@columbia.edu',
        password: hashedPassword,
        program: 'MS/MBA',
        phoneNumber: '917-555-0200',
        paymentMethod: 'PayPal',
        paymentHandle: '@mikerodriguez',
        rating: 4.6,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        firstName: 'Emma',
        lastName: 'Lee',
        name: 'Emma Lee',
        email: 'el7890@columbia.edu',
        password: hashedPassword,
        program: 'MBA',
        phoneNumber: '',
        paymentMethod: 'Venmo',
        paymentHandle: '@emmalee',
        rating: 4.8,
        createdAt: new Date().toISOString()
      }
    ];
    
    db.data.users.push(...demoUsers);
    await db.write();
  }
  
  if (db.data.tickets.length === 0) {
    const users = db.data.users;
    
    const demoTickets = [
      {
        id: uuidv4(),
        title: 'Columbia vs. Yale Football',
        category: 'Sports',
        date: '2025-11-16',
        time: '12:00',
        location: 'Baker Athletics Complex',
        eventUrl: 'https://gocolumbialions.com/sports/football',
        quantity: 2,
        price: 45,
        section: 'Section B, Row 12',
        description: 'Great seats for the big game! Selling because I have a conflict.',
        sellerId: users[1].id,
        sellerName: 'Sarah M.',
        sellerProgram: 'EMBA',
        status: 'active',
        views: 34,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Varsity Show 2025',
        category: 'Theater',
        date: '2025-04-11',
        time: '20:00',
        location: 'Minor Latham Playhouse',
        eventUrl: 'https://www.columbiavarsityshow.com/',
        quantity: 1,
        price: 30,
        section: 'Orchestra, Row F',
        description: 'Single ticket to this year\'s Varsity Show. Can\'t make it anymore.',
        sellerId: users[2].id,
        sellerName: 'Alex K.',
        sellerProgram: 'MBA',
        status: 'active',
        views: 28,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Spring Formal - Kappa Sigma',
        category: 'Greek Life',
        date: '2025-05-03',
        time: '21:00',
        location: 'Hudson Terrace',
        eventUrl: '',
        quantity: 1,
        price: 80,
        section: 'General Admission',
        description: 'Spring formal ticket. Great venue and DJ lineup!',
        sellerId: users[3].id,
        sellerName: 'Mike R.',
        sellerProgram: 'MS/MBA',
        status: 'active',
        views: 19,
        createdAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        title: 'Men\'s Basketball vs Princeton',
        category: 'Sports',
        date: '2026-01-21',
        time: '19:00',
        location: 'Levien Gymnasium',
        eventUrl: 'https://gocolumbialions.com/sports/mens-basketball',
        quantity: 3,
        price: 25,
        section: 'Courtside',
        description: 'Three courtside seats! Amazing view of the game.',
        sellerId: users[4].id,
        sellerName: 'Emma L.',
        sellerProgram: 'MBA',
        status: 'active',
        views: 42,
        createdAt: new Date().toISOString()
      }
    ];
    
    db.data.tickets.push(...demoTickets);
    await db.write();
  }
}

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

app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, program, phoneNumber, paymentMethod, paymentHandle } = req.body;
    
    if (!email.endsWith('@columbia.edu')) {
      return res.status(400).json({ error: 'Must use Columbia email address' });
    }
    
    if (!firstName || !lastName || !program || !paymentMethod || !paymentHandle) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }
    
    await db.read();
    
    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: uuidv4(),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      program,
      phoneNumber: phoneNumber || '',
      paymentMethod,
      paymentHandle,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };
    
    db.data.users.push(user);
    await db.write();
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        program: user.program,
        phoneNumber: user.phoneNumber,
        paymentMethod: user.paymentMethod,
        paymentHandle: user.paymentHandle,
        rating: user.rating
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    await db.read();
    
    const user = db.data.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        program: user.program,
        phoneNumber: user.phoneNumber,
        paymentMethod: user.paymentMethod,
        paymentHandle: user.paymentHandle,
        rating: user.rating
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    await db.read();
    
    let tickets = db.data.tickets.filter(t => t.status === 'active');
    
    if (req.query.category && req.query.category !== 'All Events') {
      tickets = tickets.filter(t => t.category === req.query.category);
    }
    
    if (req.query.search) {
      const searchLower = req.query.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }
    
    const groupedTickets = {};
    
    tickets.forEach(ticket => {
      const key = `${ticket.title}|${ticket.date}|${ticket.time}|${ticket.location}`;
      
      if (!groupedTickets[key]) {
        groupedTickets[key] = {
          ...ticket,
          sellers: [{
            id: ticket.id,
            sellerId: ticket.sellerId,
            sellerName: ticket.sellerName,
            sellerProgram: ticket.sellerProgram,
            quantity: ticket.quantity,
            price: ticket.price,
            section: ticket.section,
            description: ticket.description
          }],
          totalQuantity: ticket.quantity,
          minPrice: ticket.price,
          maxPrice: ticket.price,
          priceRange: ticket.price.toString()
        };
      } else {
        groupedTickets[key].sellers.push({
          id: ticket.id,
          sellerId: ticket.sellerId,
          sellerName: ticket.sellerName,
          sellerProgram: ticket.sellerProgram,
          quantity: ticket.quantity,
          price: ticket.price,
          section: ticket.section,
          description: ticket.description
        });
        
        groupedTickets[key].totalQuantity += ticket.quantity;
        groupedTickets[key].minPrice = Math.min(groupedTickets[key].minPrice, ticket.price);
        groupedTickets[key].maxPrice = Math.max(groupedTickets[key].maxPrice, ticket.price);
        
        if (groupedTickets[key].minPrice === groupedTickets[key].maxPrice) {
          groupedTickets[key].priceRange = groupedTickets[key].minPrice.toString();
        } else {
          groupedTickets[key].priceRange = `${groupedTickets[key].minPrice}-${groupedTickets[key].maxPrice}`;
        }
      }
    });
    
    const mergedTickets = Object.values(groupedTickets);
    
    res.json(mergedTickets);
  } catch (error) {
    console.error('Get tickets error:', error);
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
    
    ticket.views = (ticket.views || 0) + 1;
    await db.write();
    
    const seller = db.data.users.find(u => u.id === ticket.sellerId);
    const ticketWithSeller = {
      ...ticket,
      sellerPhone: seller?.phoneNumber || '',
      sellerPaymentMethod: seller?.paymentMethod || '',
      sellerPaymentHandle: seller?.paymentHandle || ''
    };
    
    res.json(ticketWithSeller);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { title, category, date, time, location, eventUrl, quantity, price, section, description } = req.body;
    
    await db.read();
    
    const user = db.data.users.find(u => u.id === req.user.id);
    
    const ticket = {
      id: uuidv4(),
      title,
      category,
      date,
      time,
      location,
      eventUrl: eventUrl || '',
      quantity: parseInt(quantity),
      price: parseFloat(price),
      section: section || '',
      description: description || '',
      sellerId: req.user.id,
      sellerName: `${user.firstName} ${user.lastName.charAt(0)}.`,
      sellerProgram: user.program,
      status: 'active',
      views: 0,
      createdAt: new Date().toISOString()
    };
    
    db.data.tickets.push(ticket);
    await db.write();
    
    res.json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
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
    
    Object.assign(ticket, req.body);
    await db.write();
    
    res.json(ticket);
  } catch (error) {
    console.error('Update ticket error:', error);
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
    console.error('Delete ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/my-tickets', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const tickets = db.data.tickets.filter(t => t.sellerId === req.user.id);
    
    res.json(tickets);
  } catch (error) {
    console.error('Get my tickets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

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
    console.error('Get seller stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log('📧 Demo: jd1234@columbia.edu / password123\n');
  });
}).catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
