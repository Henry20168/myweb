# Email Configuration for Booking Notifications

To enable email notifications when customers book cars, configure these environment variables in your `.env` file:

## Required SMTP Settings
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Optional Settings
```
SMTP_FROM=Aalikouch Car <noreply@aalikouch-car.com>
BOOKING_RECEIVE_EMAIL=admin@aalikouch-car.com
CONTACT_RECEIVE_EMAIL=support@aalikouch-car.com
```

## How it works
1. When a customer books a car, the system automatically sends two emails:
   - **Detailed HTML email** with full booking details and car images
   - **Short text email** for quick notification

2. Admin can view all bookings in the admin panel at `/admin-aalikouch-panel`
   - Bookings appear automatically in the "Bookings" tab
   - Admin can contact customers via phone, WhatsApp, or email
   - Full booking details are available by clicking on any reservation

## Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings > Security
3. Generate an "App Password" for your application
4. Use the app password as `SMTP_PASS`

## Alternative Email Providers
- Outlook: `smtp-mail.outlook.com:587`
- Yahoo: `smtp.mail.yahoo.com:587`
- Custom SMTP: Use your provider's settings

## Testing
After configuring the environment variables:
1. Restart the development server
2. Make a test booking through the website
3. Check both the admin panel and your email for notifications
