# Columbia Ticket Exchange - Complete Package

A fully functional marketplace for Columbia students to buy and sell event tickets.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Server
```bash
npm start
```

### Step 3: Open Browser
Navigate to: `http://localhost:3000`

**Demo Login:**
- Email: `jd1234@columbia.edu`
- Password: `password123`

---

## ✨ Features

### For Buyers:
- Browse and search tickets
- Filter by category (Sports, Theater, Concerts, Greek Life, Other)
- View merged tickets from multiple sellers
- See price ranges and total availability
- Click event URLs to visit event pages
- Contact sellers with payment information

### For Sellers:
- Create ticket listings with event URLs
- Track views and sales statistics
- Manage all listings from dashboard
- Edit or delete listings
- Display payment information to buyers

### New in This Version:
✅ **Enhanced Registration** - First/Last name, Program, Payment info  
✅ **Event URLs** - Clickable links in ticket titles  
✅ **Smart Merging** - Duplicate tickets combined with price ranges  

---

## 📋 System Requirements

- Node.js v14 or higher
- npm v6 or higher
- Modern web browser

---

## 🎯 What You Can Do

### Immediate:
1. Test the demo account
2. Create new user accounts
3. List tickets for sale
4. Browse available tickets
5. Search and filter events

### Easy Customizations:
- Change school branding (search for "Columbia")
- Modify color scheme (search for "#003865")
- Add new event categories
- Customize email domain validation

---

## 📁 Project Structure

```
columbia-ticket-marketplace-fresh/
├── server.js              # Backend API (Node.js + Express)
├── public/
│   └── index.html        # Frontend (HTML/CSS/JavaScript)
├── package.json          # Dependencies
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── db.json              # Database (auto-generated on first run)
```

---

## 🔧 Configuration

### Change Port (default: 3000)
Edit `server.js` line 12:
```javascript
const PORT = 3000; // Change to your preferred port
```

### Change JWT Secret (IMPORTANT for production)
Edit `server.js` line 13:
```javascript
const JWT_SECRET = 'your-super-secret-random-string';
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎨 Customization Examples

### Change School Name
Find and replace "Columbia" with your school name throughout the code.

### Change Color Scheme
Search for `#003865` (Columbia blue) and replace with your school color.

### Modify Programs
Edit `server.js` and `public/index.html` to change the program dropdown options.

### Add New Categories
Update the category options in both files.

---

## 📚 User Registration Fields

Users provide:
- First Name (required)
- Last Name (required)
- Columbia Email (required - @columbia.edu)
- Program (MBA/EMBA/MS/MBA/Other)
- Phone Number (optional)
- Payment Method (Venmo/Zelle/PayPal/Other)
- Payment Handle (@username or email)
- Password (required)

---

## 🎫 Ticket Features

### Create Listings With:
- Event title
- Event URL (optional - becomes clickable link)
- Category
- Date and time
- Location
- Quantity
- Price per ticket
- Section/seat information
- Description

### Smart Duplicate Merging:
Tickets with same title, date, time, and location automatically merge to show:
- Total tickets available across all sellers
- Price range (e.g., "$25-45")
- Number of sellers
- Individual seller details in expanded view

---

## 🚀 Deployment

Ready to deploy to:
- **Railway** (easiest - 5 minutes)
- **Render** (free tier available)
- **Heroku** (classic choice)
- **DigitalOcean** (scalable)
- **AWS** (enterprise)

See deployment guides in the original package for detailed instructions.

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't login?
```bash
# Reset database
rm db.json
npm start
# Try demo login again
```

### Port already in use?
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 [PID]
# Or change PORT in server.js
```

---

## 📞 Support

**Common Issues:**
- Dependencies error → Run `npm install`
- Login fails → Delete `db.json` and restart
- Port in use → Change PORT in `server.js`

**Check:**
- Node.js version: `node --version` (should be v14+)
- npm version: `npm --version` (should be v6+)
- Server logs in terminal for errors
- Browser console (F12) for frontend errors

---

## 🎓 Demo Data

Includes pre-loaded:
- 5 user accounts
- 4 sample tickets across different categories
- Seller statistics
- Various event types

Demo account works immediately - no setup needed!

---

## 🔒 Security Notes

**Before Production:**
- [ ] Change JWT_SECRET to random string
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Use production database (PostgreSQL/MongoDB)
- [ ] Configure CORS for specific domains
- [ ] Add input validation
- [ ] Set up error monitoring

---

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Tickets
- `GET /api/tickets` - List all tickets (with filters)
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create listing (auth required)
- `PUT /api/tickets/:id` - Update listing (auth required)
- `DELETE /api/tickets/:id` - Delete listing (auth required)

### Seller
- `GET /api/my-tickets` - Get user's listings (auth required)
- `GET /api/seller-stats` - Get seller stats (auth required)

---

## 💡 Tips

1. **Delete `db.json`** if you want fresh demo data
2. **Clear browser cache** if UI doesn't update
3. **Check terminal logs** for backend errors
4. **Check browser console (F12)** for frontend errors
5. **Use demo account** to explore features quickly

---

## 🎉 You're Ready!

Everything is included and ready to run:
✅ Complete backend with all features  
✅ Full frontend with modern UI  
✅ Demo data pre-configured  
✅ All dependencies listed  

Just run:
```bash
npm install
npm start
```

**Built with ❤️ for Columbia students**

Ready to launch your ticket marketplace! 🚀
