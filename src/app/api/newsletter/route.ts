import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Welcome to aalikouch car - Your Exclusive Offers Await!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
            .header { background-color: #111827; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px; background-color: #ffffff; }
            .offer-card { background-color: #f9fafb; border-left: 4px solid #e11d48; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .button { display: inline-block; background-color: #e11d48; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; }
            h1 { margin: 0; font-size: 24px; }
            h2 { color: #111827; margin-top: 0; }
            .price { font-size: 20px; color: #e11d48; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>aalikouch car</h1>
              <p>Premium Car Rental in Morocco</p>
            </div>
            <div class="content">
              <h2>Welcome to our Community!</h2>
              <p>Thank you for subscribing to our newsletter. We are excited to have you with us! As a subscriber, you'll be the first to know about our newest arrivals and exclusive promotions.</p>
              
              <div class="offer-card">
                <h3>Current Special Promotion</h3>
                <p>Enjoy <strong>15% OFF</strong> your next rental of 3 days or more!</p>
                <p>Use code: <span style="background-color: #fff; padding: 5px 10px; border: 1px dashed #e11d48; border-radius: 4px; font-weight: bold;">WELCOME15</span></p>
              </div>

              <h3>Featured Fleet Additions</h3>
              <p>Check out our latest premium vehicles ready for your next adventure in Morocco.</p>
              
              <table width="100%" cellspacing="0" cellpadding="10">
                <tr>
                  <td width="50%" style="border: 1px solid #eee; border-radius: 8px; text-align: center;">
                    <img src="https://assets.invygo.com/car-images%2F4f593bf3-4c8e-49cd-a7ed-e55bb41a2c3e_Untitled-4.png" alt="Hyundai Accent" width="100%" style="border-radius: 5px;">
                    <p><strong>Hyundai Accent 2025</strong></p>
                    <p class="price">From 300 MAD/Day</p>
                  </td>
                  <td width="50%" style="border: 1px solid #eee; border-radius: 8px; text-align: center;">
                    <img src="https://sihabicaressaouira.com/wp-content/uploads/2025/06/touareg-1.png" alt="VW Touareg" width="100%" style="border-radius: 5px;">
                    <p><strong>VW Touareg</strong></p>
                    <p class="price">From 800 MAD/Day</p>
                  </td>
                </tr>
              </table>

              <center>
                <a href="https://aalikouch-car.com/cars" class="button">Browse All Cars</a>
              </center>
            </div>
            <div class="footer">
              <p>&copy; 2026 aalikouch car. All rights reserved.</p>
              <p>You received this email because you subscribed to our newsletter at aalikouch-car.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
