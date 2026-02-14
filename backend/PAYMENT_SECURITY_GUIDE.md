# Payment Integration & Security Setup Guide

## 🔒 Security Features Implemented

### 1. Security Headers (Helmet.js)
- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Enforces HTTPS
- **X-XSS-Protection**: Additional XSS protection

### 2. Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Auth Routes**: 5 requests per 15 minutes per IP
- Prevents DDoS and brute force attacks

### 3. Input Sanitization
- **NoSQL Injection Prevention**: Sanitizes MongoDB queries
- **XSS Protection**: Cleans user input
- **HPP Protection**: Prevents HTTP parameter pollution

### 4. Error Handling
- Centralized error handler
- Custom AppError class
- Different responses for dev/production
- Handles Mongoose, JWT, and validation errors

---

## 💳 Payment Integration (Stripe)

### Setup Instructions

1. **Get Stripe API Keys**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy your test keys
   - Add to `.env` file:
     ```
     STRIPE_SECRET_KEY=sk_test_your_key_here
     STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
     ```

2. **Set Up Webhook (Optional for Production)**
   - Go to https://dashboard.stripe.com/test/webhooks
   - Add endpoint: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to `.env`:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
     ```

### Payment Flow

1. **Create Payment Intent**
   ```javascript
   POST /api/payment/create-payment-intent
   Headers: { "token": "your_jwt_token" }
   Body: { "amount": 1000, "orderId": "order_id" }
   
   Response: {
     "clientSecret": "pi_xxx_secret_xxx",
     "paymentIntentId": "pi_xxx"
   }
   ```

2. **Handle Payment on Frontend**
   - Use Stripe.js or Stripe Elements
   - Confirm payment with clientSecret
   - Stripe handles card processing

3. **Webhook Updates Order**
   - Stripe sends webhook on payment success/failure
   - Backend updates order payment status automatically

4. **Check Payment Status**
   ```javascript
   GET /api/payment/status/:paymentIntentId
   Headers: { "token": "your_jwt_token" }
   
   Response: {
     "status": "succeeded",
     "amount": 1000,
     "currency": "inr"
   }
   ```

### Supported Payment Methods
- ✅ Credit/Debit Cards
- ✅ UPI (via Stripe)
- ✅ Cash on Delivery (COD) - handled separately in order flow

---

## 🛡️ Security Best Practices

### Environment Variables
- Never commit `.env` file
- Use strong, random JWT_SECRET
- Rotate secrets regularly in production

### HTTPS in Production
- Use SSL/TLS certificates
- Redirect HTTP to HTTPS
- Set `NODE_ENV=production`

### Database Security
- Use strong MongoDB passwords
- Enable MongoDB authentication
- Use MongoDB Atlas for cloud hosting
- Regular backups

### API Security
- All sensitive routes use JWT authentication
- Admin routes use role-based access control
- Input validation on all endpoints
- Rate limiting prevents abuse

---

## 📝 Testing Payment Integration

### Test Mode (Development)
1. Use Stripe test keys
2. Test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

3. Any future expiry date (e.g., 12/34)
4. Any 3-digit CVC

### Production Checklist
- [ ] Replace test keys with live keys
- [ ] Set up webhook endpoint
- [ ] Enable HTTPS
- [ ] Test with real cards (small amounts)
- [ ] Monitor Stripe dashboard
- [ ] Set up error notifications

---

## 🚨 Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Check server logs |

---

## 📊 Monitoring & Logging

### What's Logged
- All errors with stack traces
- Payment intent creation
- Webhook events
- Database connection status
- Rate limit violations

### Production Recommendations
- Use Winston or Morgan for logging
- Set up error tracking (Sentry, Rollbar)
- Monitor Stripe dashboard
- Set up uptime monitoring
- Regular security audits

---

## 🔧 Configuration

### Required Environment Variables
```env
# Database
MONGO_URI=mongodb://127.0.0.1:27017/grocery

# JWT
JWT_SECRET=your_strong_secret_key

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Security Middleware Order (Important!)
1. Helmet (security headers)
2. Rate limiting
3. Body parser (with size limits)
4. Data sanitization
5. XSS protection
6. HPP protection
7. CORS
8. Routes
9. 404 handler
10. Error handler (must be last)

---

## 🎯 Next Steps

1. **Frontend Integration**
   - Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
   - Create payment form component
   - Handle payment confirmation

2. **Enhanced Features**
   - Email notifications for orders
   - SMS notifications
   - Refund handling
   - Subscription payments

3. **Production Deployment**
   - Set up HTTPS
   - Configure production Stripe keys
   - Set up webhook endpoint
   - Enable monitoring
   - Regular security updates
