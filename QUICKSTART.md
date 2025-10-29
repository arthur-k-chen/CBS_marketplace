# Columbia Ticket Exchange - Quick Start Guide

## What You've Got

A fully functional ticket marketplace platform with:
- Complete backend API with authentication
- Modern, responsive frontend
- Database with demo data
- User authentication and authorization
- Seller dashboard with statistics
- Ticket browsing and searching

## Getting Started (5 minutes)

### Step 1: Extract and Setup
```bash
# Extract the archive
tar -xzf columbia-ticket-marketplace.tar.gz
cd columbia-ticket-marketplace

# Install dependencies
npm install
```

### Step 2: Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 3: Open Your Browser
Navigate to: `http://localhost:3000`

### Step 4: Login with Demo Account
- **Email:** jd1234@columbia.edu
- **Password:** password123

## What You Can Do

### As a Buyer:
1. Browse tickets on the "Buy Tickets" tab
2. Use search bar to find specific events
3. Filter by category (Sports, Theater, Concerts, etc.)
4. Click any ticket to see full details
5. Contact sellers to purchase

### As a Seller:
1. Switch to "Sell Tickets" tab
2. Click "Create New Listing"
3. Fill in event details
4. Submit to list your tickets
5. View your stats and manage listings
6. Edit or delete your tickets

## Key Features

✅ **User Authentication**
- Secure JWT-based authentication
- Columbia email verification
- Password hashing with bcrypt

✅ **Ticket Management**
- Create, edit, delete listings
- Real-time view tracking
- Status management (active/sold)

✅ **Search & Filter**
- Full-text search
- Category filtering
- Responsive design

✅ **Seller Dashboard**
- Active listings count
- Total tickets sold
- Revenue tracking
- Seller rating

## File Structure

```
columbia-ticket-marketplace/
├── server.js              # Backend API (Express + LowDB)
├── public/
│   └── index.html        # Frontend (HTML + CSS + JS)
├── package.json          # Dependencies
├── db.json               # Database (auto-generated)
└── README.md             # Full documentation
```

## API Endpoints Overview

- **Auth:** `/api/auth/login`, `/api/auth/register`
- **Tickets:** `/api/tickets` (GET/POST/PUT/DELETE)
- **Seller:** `/api/my-tickets`, `/api/seller-stats`
- **Transactions:** `/api/transactions`

## Demo Data Included

The app comes with:
- 5 demo users (including the login account)
- 4 sample tickets across different categories
- Pre-configured seller stats

## Customization

### Change Port (default: 3000)
Edit `server.js` line 13:
```javascript
const PORT = 3000; // Change to your preferred port
```

### Change JWT Secret
Edit `server.js` line 14:
```javascript
const JWT_SECRET = 'your-new-secret-key';
```

### Modify Columbia Branding
Edit `public/index.html` - search for `#003865` (Columbia blue)

## Production Deployment Checklist

Before deploying to production:

1. ✅ Change JWT_SECRET to a strong, random value
2. ✅ Use environment variables for secrets
3. ✅ Set up HTTPS
4. ✅ Add rate limiting
5. ✅ Use a production database (PostgreSQL/MongoDB)
6. ✅ Configure CORS for specific domains
7. ✅ Add email verification
8. ✅ Set up proper logging
9. ✅ Add payment integration

## Troubleshooting

**Server won't start?**
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is available
- Try: `npm install` again

**Can't login?**
- Use demo credentials exactly as shown
- Check browser console for errors
- Make sure server is running

**Database issues?**
- Delete `db.json` file and restart server
- Database will regenerate with demo data

## Next Steps

1. **Add More Features:**
   - Image uploads for tickets
   - Real-time messaging
   - Payment integration (Stripe)
   - Email notifications

2. **Improve Security:**
   - Add email verification
   - Implement rate limiting
   - Add CAPTCHA for signup

3. **Scale:**
   - Deploy to cloud (Heroku, AWS, DigitalOcean)
   - Use PostgreSQL or MongoDB
   - Add Redis for caching
   - Set up CDN for static files

4. **Mobile:**
   - Create React Native app
   - Add push notifications
   - Optimize for mobile browsers

## Support

For detailed documentation, see `README.md`

For issues:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Make sure you're using Node.js v14+

## License

MIT - Feel free to use and modify for your needs!

---

**Built for Columbia Students** 🦁💙
Ready to deploy and customize for your campus!
