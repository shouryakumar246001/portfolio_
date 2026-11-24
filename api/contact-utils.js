const DEFAULT_RECIPIENT_EMAIL = 'shourya24600101@gmail.com';

export function validateContactPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body' };
  }

  const { name, email, subject, message } = body;

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Name is required' };
  }
  if (typeof email !== 'string' || !email.trim() || !email.trim().includes('@')) {
    return { error: 'Valid email is required' };
  }
  if (subject !== undefined && subject !== null && typeof subject !== 'string') {
    return { error: 'Subject must be text' };
  }
  if (typeof message !== 'string' || !message.trim()) {
    return { error: 'Message is required' };
  }

  const cleanName = name.trim();
  return {
    data: {
      name: cleanName,
      email: email.trim(),
      subject: subject?.trim() || `New Inquiry from ${cleanName}`,
      message: message.trim(),
    },
  };
}

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function getSmtpOptions(env = process.env) {
  const port = env.SMTP_PORT ? Number(env.SMTP_PORT) : 465;
  const secureSetting = env.SMTP_SECURE?.toLowerCase();

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be an integer between 1 and 65535');
  }
  if (secureSetting !== undefined && secureSetting !== 'true' && secureSetting !== 'false') {
    throw new Error('SMTP_SECURE must be either true or false');
  }

  return {
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: secureSetting === undefined ? port === 465 : secureSetting === 'true',
    auth: {
      user: env.SMTP_USER || env.RECIPIENT_EMAIL || DEFAULT_RECIPIENT_EMAIL,
      pass: env.SMTP_PASS,
    },
  };
}
