import assert from 'node:assert/strict';
import test from 'node:test';
import { escapeHtml, getSmtpOptions, validateContactPayload } from './contact-utils.js';

test('validates and normalizes contact form payloads', () => {
  assert.deepEqual(
    validateContactPayload({
      name: '  Riley Example ',
      email: ' riley@example.com ',
      subject: '  ',
      message: '  Hello there  ',
    }),
    {
      data: {
        name: 'Riley Example',
        email: 'riley@example.com',
        subject: 'New Inquiry from Riley Example',
        message: 'Hello there',
      },
    }
  );
});

test('rejects non-string contact fields instead of throwing', () => {
  assert.deepEqual(
    validateContactPayload({ name: ['not a name'], email: 'riley@example.com', message: 'Hello' }),
    { error: 'Name is required' }
  );
  assert.deepEqual(
    validateContactPayload({ name: 'Riley', email: 'riley@example.com', message: { text: 'Hello' } }),
    { error: 'Message is required' }
  );
});

test('escapes untrusted text before inserting it into HTML email content', () => {
  assert.equal(escapeHtml(`<img src=x onerror="run()">&'`), '&lt;img src=x onerror=&quot;run()&quot;&gt;&amp;&#39;');
});

test('uses configured SMTP host, port, and TLS mode', () => {
  assert.deepEqual(
    getSmtpOptions({
      SMTP_HOST: 'mail.example.com',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: 'sender@example.com',
      SMTP_PASS: 'app-password',
    }),
    {
      host: 'mail.example.com',
      port: 587,
      secure: false,
      auth: { user: 'sender@example.com', pass: 'app-password' },
    }
  );
});
