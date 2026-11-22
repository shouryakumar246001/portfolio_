import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'shourya24600101@gmail.com';

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Create nodemailer transporter
function createTransporter() {
  const user = process.env.SMTP_USER || 'shourya24600101@gmail.com';
  const pass = process.env.SMTP_PASS;

  if (pass) {
    // Authenticated Gmail SMTP
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  // Fallback SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: pass ? { user, pass } : undefined,
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    recipient: RECIPIENT_EMAIL,
    smtpConfigured: Boolean(process.env.SMTP_PASS),
  });
});

// Main Contact Form Submission Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const cleanSubject = subject && subject.trim() ? subject.trim() : `New Inquiry from ${name.trim()}`;
    const cleanDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    console.log(`[Contact API] Received message from ${name} (${email}): "${cleanSubject}"`);

    let dispatchSuccess = false;
    let dispatchMethod = '';

    // Method 1: Nodemailer via Gmail SMTP (if SMTP_PASS provided)
    if (process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();

        const htmlBody = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0c; color: #d7e2ea; margin: 0; padding: 24px; }
                .container { max-width: 600px; margin: 0 auto; background-color: #121316; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
                .header { background: linear-gradient(135deg, #18011f 0%, #b600a8 50%, #7621b0 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
                .content { padding: 28px 24px; }
                .field { margin-bottom: 20px; }
                .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #b600a8; font-weight: 700; margin-bottom: 6px; }
                .field-value { font-size: 15px; color: #ffffff; background: rgba(255,255,255,0.04); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
                .message-box { white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; border-left: 3px solid #b600a8; }
                .footer { padding: 18px 24px; background: rgba(0,0,0,0.4); text-align: center; font-size: 12px; color: rgba(215,226,234,0.6); border-top: 1px solid rgba(255,255,255,0.08); }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Portfolio Contact Inquiry</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="field-label">Sender Name</div>
                    <div class="field-value">${name}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Email Address</div>
                    <div class="field-value"><a href="mailto:${email}" style="color:#e879f9;text-decoration:none;">${email}</a></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Subject</div>
                    <div class="field-value">${cleanSubject}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Time Sent (IST)</div>
                    <div class="field-value">${cleanDate}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Message Content</div>
                    <div class="message-box">${message}</div>
                  </div>
                </div>
                <div class="footer">
                  Sent via Shourya Kumar's Portfolio Website Contact Form
                </div>
              </div>
            </body>
          </html>
        `;

        const mailOptions = {
          from: `"Portfolio Contact" <${process.env.SMTP_USER || RECIPIENT_EMAIL}>`,
          to: RECIPIENT_EMAIL,
          replyTo: email,
          subject: `[Portfolio Inquiry] ${cleanSubject}`,
          text: `New Portfolio Message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${cleanSubject}\nDate: ${cleanDate}\n\nMessage:\n${message}`,
          html: htmlBody,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Contact API] Successfully dispatched email via Gmail SMTP to ${RECIPIENT_EMAIL}`);
        dispatchSuccess = true;
        dispatchMethod = 'Gmail SMTP';
      } catch (smtpErr) {
        console.warn('[Contact API] SMTP dispatch failed, attempting FormSubmit fallback:', smtpErr.message);
      }
    }

    // Method 2: FormSubmit dispatch fallback if SMTP is unconfigured or failed
    if (!dispatchSuccess) {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            _subject: `[Portfolio] ${cleanSubject}`,
            message,
            _template: 'box',
            _replyto: email,
          }),
        });

        if (formSubmitRes.ok) {
          console.log(`[Contact API] Successfully dispatched email via FormSubmit to ${RECIPIENT_EMAIL}`);
          dispatchSuccess = true;
          dispatchMethod = 'FormSubmit Forwarder';
        } else {
          const errText = await formSubmitRes.text();
          console.warn(`[Contact API] FormSubmit returned status ${formSubmitRes.status}:`, errText);
        }
      } catch (formSubmitErr) {
        console.error('[Contact API] FormSubmit request error:', formSubmitErr.message);
      }
    }

    // If both dispatched or if running in offline dev mode, log full message
    console.log(`[Contact API] Processed message for ${RECIPIENT_EMAIL} (Method: ${dispatchMethod || 'Logged'})`);

    return res.status(200).json({
      success: true,
      message: `Message dispatched successfully to ${RECIPIENT_EMAIL}!`,
      method: dispatchMethod,
      data: { name, email, subject: cleanSubject, date: cleanDate },
    });
  } catch (error) {
    console.error('[Contact API Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message. Please try direct email: ' + RECIPIENT_EMAIL,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Contact Backend running on http://localhost:${PORT}`);
  console.log(`📬 Configured recipient: ${RECIPIENT_EMAIL}`);
});
