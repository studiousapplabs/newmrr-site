/* This static page is a payment-review handoff, NOT a payment verifier.
 * Only a trusted server may verify Stripe payment before kit fulfillment.
 * Never release premium output based on URL, query string, or sessionStorage.
 */
(() => {
  'use strict';
  const link = document.getElementById('requestReview');
  const status = document.getElementById('reviewStatus');
  if (!link || !status) return;

  let pending = {};
  try {
    const raw = sessionStorage.getItem('newmrr_pending_kit');
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      pending = parsed;
    }
  } catch (_) {
    // Invalid local data must not prevent the customer from requesting help.
  }

  // Limit the email draft length and never place private customer data in a URL
  // until the customer chooses to open their own email client.
  const field = (name, limit = 400) => String(pending[name] || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, limit);

  const lines = [
    'Hello NewMRR,',
    '',
    'Please review my Founder Rec Rev Kit payment and request.',
    'Receipt email (confirm or fill in): ' + (field('email', 180) || '[enter receipt email]'),
    'Stripe receipt/reference (optional): [enter reference]',
    '',
    'Name: ' + (field('name', 120) || '[enter name]'),
    'Skill: ' + (field('skill') || '[enter skill]'),
    'Buyer: ' + (field('buyer') || '[enter buyer]'),
    'Buyer pain: ' + (field('pain') || '[enter problem]'),
    'Recurring model: ' + (field('model', 80) || '[enter model]'),
    'Goal: ' + (field('goal', 80) || '[enter monthly goal]'),
    '',
    'Please verify payment in Stripe before fulfilling the kit.',
    'I have not included card numbers or passwords.'
  ];

  // mailto opens a local draft; it does not send email automatically.
  link.href = 'mailto:studiousapplabs@gmail.com?subject=' +
    encodeURIComponent('NewMRR Founder Kit payment review') +
    '&body=' + encodeURIComponent(lines.join('\n'));

  if (field('skill')) {
    status.textContent = 'Your saved Skill Map details are included in the email draft. Review the draft and send it from your own email app.';
  } else {
    status.textContent = 'Your Skill Map answers were not found on this device. Fill in the missing fields in the email draft before sending.';
  }
})();
