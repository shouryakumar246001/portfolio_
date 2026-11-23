import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export default async function handler(req, res) {
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

    // Method 1: Resend (Official Vercel Partner - 100% Inbox Delivery)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          reply_to: email,
          subject: `[Portfolio] ${cleanSubject}`,
          text: `Name: ${name}\nEmail: ${email}\nDate: ${cleanDate}\n\nMessage:\n${message}`,
        });

        if (!error) {
          return res.status(200).json({
            success: true,
            method: 'Resend Cloud Delivery',
            message: `Delivered directly to ${RECIPIENT_EMAIL}`,
          });
        }
      } catch (resendErr) {
        console.warn('Resend failed:', resendErr.message);
      }
    }

    // Method 2: Gmail SMTP
    if (process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_USER || RECIPIENT_EMAIL,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER || RECIPIENT_EMAIL}>`,
          to: RECIPIENT_EMAIL,
          replyTo: email,
          subject: `[Portfolio] ${cleanSubject}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${cleanSubject}\nDate: ${cleanDate}\n\nMessage:\n${message}`,
        });

        return res.status(200).json({
          success: true,
          method: 'Gmail SMTP',
          message: `Delivered directly to ${RECIPIENT_EMAIL}`,
        });
      } catch (smtpErr) {
        console.warn('SMTP failed:', smtpErr.message);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    let formSubmitResponse;
    try {
      formSubmitResponse = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _subject: `[Portfolio] ${cleanSubject}`,
          message: message.trim(),
          _captcha: 'false',
          _template: 'box',
          _replyto: email.trim(),
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    let formSubmitData;
    try {
      formSubmitData = await formSubmitResponse.json();
    } catch {
      return res.status(502).json({
        success: false,
        error: 'The email service returned an unreadable response. Please try again or use the email app option.',
      });
    }

    if (typeof formSubmitData.message === 'string' && /activation|confirm.*email|verify.*email/i.test(formSubmitData.message)) {
      return res.status(409).json({
        success: false,
        needsActivation: true,
        method: 'FormSubmit Activation Required',
        message: formSubmitData.message,
      });
    }

    if (formSubmitResponse.ok && (formSubmitData.success === 'true' || formSubmitData.success === true)) {
      return res.status(200).json({
        success: true,
        method: 'FormSubmit Forwarder',
        message: `Message dispatched successfully to ${RECIPIENT_EMAIL}!`,
      });
    }

    console.error('FormSubmit delivery failed:', formSubmitData.message || formSubmitResponse.status);
    return res.status(502).json({
      success: false,
      error: formSubmitData.message || 'The email service could not deliver your message. Please use the email app option or try again later.',
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process message.',
    });
  }
}
