# Deployment Guide

This guide covers deploying the Columbia Ticket Exchange to various platforms.

## Quick Deploy Options

### 1. Heroku (Easiest)

**Prerequisites:** Heroku account and Heroku CLI installed

```bash
# Login to Heroku
heroku login

# Create new app
heroku create columbia-tickets

# Set environment variables
heroku config:set JWT_SECRET=your-super-secret-key-here

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Open app
heroku open
```

**Note:** Heroku uses ephemeral filesystem, so you'll need to add a proper database:
```bash
# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Or use MongoDB
heroku addons:create mongodb:sandbox
```

### 2. Railway (Modern & Simple)

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Connect your repository
5. Railway auto-detects Node.js and deploys
6. Add environment variables in Railway dashboard

### 3. DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect GitHub repository or upload code
4. Configure:
   - Environment: Node.js
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Add environment variables
6. Deploy

### 4. AWS (EC2)

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone your repository
git clone your-repo-url
cd columbia-ticket-marketplace

# Install dependencies
npm install

# Set environment variables
export JWT_SECRET=your-secret-key

# Start with PM2
pm2 start server.js --name "ticket-marketplace"
pm2 save
pm2 startup

# Install nginx
sudo apt install nginx

# Configure nginx as reverse proxy
sudo nano /etc/nginx/sites-available/default
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Restart nginx
sudo systemctl restart nginx
```

### 5. Vercel (Frontend + Serverless)

Vercel works great but requires converting to serverless functions.

Create `api/` folder and convert routes to serverless functions.

Example: `api/tickets.js`
```javascript
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

module.exports = async (req, res) => {
  const adapter = new JSONFile('/tmp/db.json');
  const db = new Low(adapter, {});
  await db.read();
  
  // Your ticket logic here
  res.json(db.data.tickets);
};
```

Deploy:
```bash
npm install -g vercel
vercel
```

### 6. Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=your-secret-key
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Environment Variables

Set these in your deployment platform:

```bash
# Required
JWT_SECRET=your-super-secret-random-string

# Optional
PORT=3000
NODE_ENV=production
```

## Database Migration

For production, replace LowDB with a proper database:

### PostgreSQL Option

```bash
npm install pg --save
```

Example connection:
```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### MongoDB Option

```bash
npm install mongodb --save
```

Example connection:
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('ticketmarketplace');
```

## Security Checklist

Before going live:

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add helmet.js for security headers
- [ ] Add input validation (express-validator)
- [ ] Set up proper CORS
- [ ] Add logging (winston, morgan)
- [ ] Set up error monitoring (Sentry)
- [ ] Add email verification
- [ ] Implement CAPTCHA on signup
- [ ] Add CSP headers
- [ ] Use secure cookies
- [ ] Add API versioning

## Monitoring & Logging

### Add Winston Logger

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Add Error Tracking with Sentry

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

app.use(Sentry.Handlers.errorHandler());
```

## Performance Optimization

1. **Add Compression**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Redis Caching**
```bash
npm install redis
```

3. **Enable Gzip in Nginx**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

4. **Use CDN for Static Assets**
- Upload static files to S3/Cloudinary
- Use CloudFront/Cloudflare CDN

## Custom Domain Setup

### With Namecheap/GoDaddy

1. Buy domain
2. Point A record to your server IP
3. Set up SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### With Cloudflare

1. Add domain to Cloudflare
2. Update nameservers at registrar
3. Enable SSL/TLS (Full mode)
4. Enable CDN
5. Add firewall rules

## Scaling Considerations

As your app grows:

1. **Load Balancer:** Add nginx load balancer
2. **Database Replication:** Set up read replicas
3. **Caching:** Redis for sessions and frequently accessed data
4. **Queue System:** Bull for background jobs
5. **Microservices:** Split into smaller services
6. **Auto-scaling:** Use Kubernetes or cloud auto-scaling

## Backup Strategy

1. **Database Backups**
```bash
# PostgreSQL
pg_dump database_name > backup.sql

# MongoDB
mongodump --uri="mongodb://..." --out=/backup
```

2. **Automated Backups**
- Set up cron jobs
- Use cloud backup services
- Store in S3/Backblaze

3. **Disaster Recovery**
- Document recovery procedures
- Test backups regularly
- Keep backups in multiple locations

## Cost Estimates

### Hobby/Small Scale (< 1000 users)
- **Heroku:** $7-25/month
- **Railway:** $5-20/month
- **DigitalOcean:** $12-24/month
- **AWS EC2 t3.micro:** $8-15/month

### Medium Scale (1000-10000 users)
- **DigitalOcean:** $40-100/month
- **AWS:** $50-200/month
- **Dedicated Server:** $50-150/month

### Large Scale (10000+ users)
- **Cloud Platform:** $200-1000+/month
- Consider managed services
- Add CDN, load balancers, etc.

## Support & Maintenance

1. **Monitor uptime:** Use UptimeRobot or Pingdom
2. **Set up alerts:** Email/SMS for downtime
3. **Update dependencies:** Monthly security updates
4. **Review logs:** Weekly log analysis
5. **User feedback:** Set up feedback system

## Troubleshooting Common Issues

**App crashes on startup:**
- Check Node.js version
- Verify environment variables
- Review error logs

**Database connection fails:**
- Check connection string
- Verify firewall rules
- Test database access

**High memory usage:**
- Add memory limits
- Optimize database queries
- Use caching

**Slow response times:**
- Add database indexes
- Enable caching
- Optimize images
- Use CDN

## Next Steps After Deployment

1. Test all functionality
2. Set up monitoring
3. Configure backups
4. Add analytics (Google Analytics)
5. Set up error tracking
6. Test mobile responsiveness
7. Run security audit
8. Create user documentation
9. Plan marketing strategy
10. Gather user feedback

---

## Quick Links

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [12 Factor App](https://12factor.net/)

**Questions?** Review the main README.md for detailed documentation.
