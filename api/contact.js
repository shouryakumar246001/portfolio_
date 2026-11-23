import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'shourya24600101@gmail.com';
    const cleanSubject = subject && subject.trim() ? subject.trim() : `New Inquiry from ${name.trim()}`;
    const cleanDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Method 1: Gmail SMTP via Nodemailer (if SMTP_PASS is provided in Vercel environment variables)
    if (process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER || RECIPIENT_EMAIL,
            pass: process.env.SMTP_PASS,
          },
        });

        const htmlBody = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0c0c0c; color: #d7e2ea; padding: 24px; }
                .container { max-width: 600px; margin: 0 auto; background-color: #121316; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); overflow: hidden; }
                .header { background: linear-gradient(135deg, #18011f 0%, #b600a8 50%, #7621b0 100%); padding: 24px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; }
                .content { padding: 24px; }
                .field { margin-bottom: 18px; }
                .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #b600a8; font-weight: 700; margin-bottom: 6px; }
                .field-value { font-size: 15px; color: #ffffff; background: rgba(255,255,255,0.04); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); }
                .message-box { white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; border-left: 3px solid #b600a8; }
                .footer { padding: 16px; background: rgba(0,0,0,0.4); text-align: center; font-size: 12px; color: rgba(215,226,234,0.6); }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Portfolio Contact Message</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="field-label">Sender Name</div>
                    <div class="field-value">${name}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Email Address</div>
                    <div class="field-value"><a href="mailto:${email}" style="color:#e879f9;">${email}</a></div>
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
                  Sent via Shourya Kumar's Portfolio
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER || RECIPIENT_EMAIL}>`,
          to: RECIPIENT_EMAIL,
          replyTo: email,
          subject: `[Portfolio] ${cleanSubject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${cleanSubject}\nDate: ${cleanDate}\n\nMessage:\n${message}`,
          html: htmlBody,
        });

        return res.status(200).json({
          success: true,
          method: 'Gmail SMTP',
          message: `Message dispatched successfully to ${RECIPIENT_EMAIL}`,
        });
      } catch (smtpErr) {
        console.warn('Vercel SMTP failed, attempting forwarder:', smtpErr.message);
      }
    }

    // Method 2: FormSubmit Forwarder with proper Origin/Referer headers
    try {
      const origin = req.headers.origin || (req.headers.host ? `https://${req.headers.host}` : 'https://portfolio-main-1-psi.vercel.app');
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': origin,
          'Referer': `${origin}/`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _subject: `[Portfolio] ${cleanSubject}`,
          message: message.trim(),
          _template: 'box',
          _replyto: email.trim(),
        }),
      });

      const data = await formSubmitRes.json();

      if (data.success === 'true' || data.success === true) {
        return res.status(200).json({
          success: true,
          needsActivation: false,
          method: 'FormSubmit Forwarder',
          message: `Message delivered directly to ${RECIPIENT_EMAIL}`,
        });
      }

      if (data.message && data.message.includes('Activation')) {
        return res.status(200).json({
          success: true,
          needsActivation: true,
          method: 'FormSubmit Activation Required',
          message: data.message,
        });
      }

      return res.status(500).json({
        success: false,
        error: data.message || 'FormSubmit delivery error',
      });
    } catch (fsErr) {
      console.error('FormSubmit fallback error:', fsErr.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to dispatch message.',
      });
    }
  } catch (err) {
    console.error('Contact API Handler Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message.',
    });
  }
}
