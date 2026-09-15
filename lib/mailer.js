// lib/mailer.js
// Optional email notification whenever a new lead comes in.
// If SMTP settings aren't configured in .env, this quietly does nothing —
// leads are always saved to the database regardless of email.

const nodemailer = require('nodemailer');

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendLeadNotification(lead) {
  const transporter = getTransporter();
  const to = process.env.NOTIFY_EMAIL;

  if (!transporter) {
    console.warn('Email notification skipped: SMTP_HOST, SMTP_USER, or SMTP_PASS is not set.');
    return;
  }
  if (!to) {
    console.warn('Email notification skipped: NOTIFY_EMAIL is not set.');
    return;
  }

  const subject = `New quote request: ${lead.name} (${lead.service || 'general'})`;
  const text = [
    `New lead from the OB website`,
    ``,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || '-'}`,
    `Address: ${lead.address || '-'}`,
    `Service: ${lead.service || '-'}`,
    `Budget range: ${lead.budget_range || '-'}`,
    `Message: ${lead.message || '-'}`,
    ``,
    `Submitted: ${lead.created_at}`,
  ].join('\n');

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  });
  console.log(`Lead notification email sent to ${to}.`);
}

module.exports = { sendLeadNotification };
