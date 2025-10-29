# Columbia Ticket Exchange

A fully functional marketplace platform for Columbia University students to buy and sell event tickets.

## Features

### For Buyers
- Browse and search available tickets
- Filter by category (Sports, Theater, Concerts, Greek Life, Other)
- View detailed ticket information including seller details
- Contact sellers directly

### For Sellers
- Create and manage ticket listings
- Track views and statistics
- Edit or delete listings
- View sales history and revenue
- Seller rating system

### Security
- User authentication with JWT tokens
- Columbia email verification (@columbia.edu)
- Password hashing with bcrypt
- Protected API endpoints

## Tech Stack

**Backend:**
- Node.js with Express
- LowDB (JSON-based database)
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- Vanilla JavaScript
- Modern CSS with responsive design
- Columbia University branding

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Steps

1. Navigate to the project directory:
```bash
cd columbia-ticket-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Getting Started

1. **Sign Up** with a Columbia email address (@columbia.edu)
   - Required fields: Name, Email, School (CC/SEAS/GS/BC), Year
   - Password will be securely hashed

2. **Or use the demo account:**
   - Email: `jd1234@columbia.edu`
   - Password: `password123`

### Buying Tickets

1. Navigate to the "Buy Tickets" tab
2. Use the search bar or category filters to find tickets
3. Click on a ticket card to view full details
4. Contact the seller to complete the transaction

### Selling Tickets

1. Navigate to the "Sell Tickets" tab
2. Click "Create New Listing"
3. Fill in the ticket details:
   - Event title, category, date, time, location
   - Quantity, price per ticket
   - Section/seat information
   - Description
4. Submit to create your listing
5. Manage your listings from the seller dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tickets
- `GET /api/tickets` - Get all active tickets (with optional filters)
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create new ticket (requires auth)
- `PUT /api/tickets/:id` - Update ticket (requires auth)
- `DELETE /api/tickets/:id` - Delete ticket (requires auth)
- `GET /api/my-tickets` - Get current user's tickets (requires auth)

### Seller Stats
- `GET /api/seller-stats` - Get seller statistics (requires auth)

### Transactions
- `POST /api/transactions` - Create transaction (requires auth)

## Database Structure

The application uses LowDB with a JSON file (`db.json`) containing:

### Users
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "password": "hashed string",
  "school": "CC|SEAS|GS|BC",
  "year": "string",
  "rating": "number",
  "createdAt": "ISO datetime"
}
```

### Tickets
```json
{
  "id": "uuid",
  "title": "string",
  "category": "Sports|Theater|Concerts|Greek Life|Other",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string",
  "quantity": "number",
  "price": "number",
  "section": "string",
  "description": "string",
  "sellerId": "uuid",
  "sellerName": "string",
  "sellerSchool": "string",
  "status": "active|sold",
  "views": "number",
  "createdAt": "ISO datetime"
}
```

### Transactions
```json
{
  "id": "uuid",
  "ticketId": "uuid",
  "buyerId": "uuid",
  "sellerId": "uuid",
  "quantity": "number",
  "price": "number",
  "total": "number",
  "status": "completed",
  "createdAt": "ISO datetime"
}
```

## Security Considerations

### For Production Deployment

1. **Environment Variables**: Move sensitive data to environment variables
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
   ```

2. **HTTPS**: Enable HTTPS for secure communication

3. **Rate Limiting**: Add rate limiting to prevent abuse
   ```bash
   npm install express-rate-limit
   ```

4. **Input Validation**: Add comprehensive input validation
   ```bash
   npm install express-validator
   ```

5. **Database**: Use a production database (PostgreSQL, MongoDB)

6. **CORS**: Configure CORS for specific domains only

7. **Email Verification**: Add email verification for new accounts

8. **Payment Integration**: Integrate Stripe or PayPal for secure payments

## Future Enhancements

- [ ] Real-time messaging between buyers and sellers
- [ ] Push notifications for new listings
- [ ] Image uploads for tickets
- [ ] Advanced search and filtering
- [ ] User reviews and ratings
- [ ] Payment processing integration
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Ticket verification system
- [ ] Admin dashboard for moderation

## Development

### Project Structure
```
columbia-ticket-marketplace/
├── server.js           # Backend server and API
├── public/
│   └── index.html     # Frontend application
├── db.json            # Database file (auto-generated)
├── package.json       # Dependencies
└── README.md          # This file
```

### Running in Development Mode
```bash
npm run dev
```

## License

MIT

## Support

For issues or questions, please contact the development team or create an issue in the repository.

## Acknowledgments

- Columbia University for the inspiration
- Built with ❤️ for the Columbia community
