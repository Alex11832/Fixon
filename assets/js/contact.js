// Telegram config
const TG_BOT_TOKEN = '8288505613:AAGawDGJbL0xv0WamzooETqnv92kqtM56-o';
const TG_CHAT_ID   = '1471288001';

// Elements
const form          = document.querySelector('#tg-form');
const popupEl       = document.getElementById('form-popup');
const popupTextEl   = document.getElementById('form-popup-text');
const popupCloseEl  = document.getElementById('form-popup-close');
const submitBtn     = form ? form.querySelector('input[type="submit"]') : null;

let lastFocusEl = null; // remember focus before opening popup

function openPopup(text) {
  if (text) popupTextEl.textContent = text;
  lastFocusEl = document.activeElement;
  popupEl.style.display = 'flex';
  popupEl.setAttribute('aria-hidden', 'false');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  popupCloseEl?.focus();
}

function closePopup() {
  try { document.activeElement && document.activeElement.blur(); } catch(e){}
  popupEl.setAttribute('aria-hidden', 'true');
  popupEl.style.display = 'none';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  (lastFocusEl || submitBtn)?.focus();
}

popupCloseEl?.addEventListener('click', e => { e.preventDefault(); closePopup(); });
popupEl?.addEventListener('click', e => { if (e.target === popupEl) closePopup(); });
document.addEventListener('keydown', e => { if (popupEl && popupEl.style.display === 'flex' && e.key === 'Escape') closePopup(); });

// MarkdownV2 escaping
const esc = s => String(s ?? '').replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, m => '\\' + m);

// Telegram send
async function sendToTelegram(payload) {
  const msg =
    `*FIXON — New Lead*\n` +
    `*Name:* ${esc(payload.name)}\n` +
    `*Phone:* ${esc(payload.phone)}\n` +
    (payload.email ? `*Email:* ${esc(payload.email)}\n` : '') +
    (payload.comment ? `*Message:* ${esc(payload.comment)}\n` : '') +
    `*Page:* ${esc(payload.page_url)}\n`;

  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
  const body = { chat_id: TG_CHAT_ID, text: msg, parse_mode: 'MarkdownV2', disable_web_page_preview: true };

  const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Telegram error ${res.status}`);
}

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fd = new FormData(form);

    // Honeypot
    if (fd.get('website')) {
      form.reset();
      openPopup('Thanks! We’ll call you back within 15 minutes.');
      return;
    }

    const name    = (fd.get('name') || '').trim();
    const phone   = (fd.get('phone') || '').trim();
    const email   = (fd.get('email') || '').trim(); // optional
    const comment = (fd.get('message') || fd.get('comment') || '').trim();
    const pageUrl = (fd.get('page_url') || window.location.href).trim();
    const pageTit = (fd.get('page') || document.title).trim();

    if (!name || !phone) {
      openPopup('Please enter your name and phone number.');
      return;
    }

    submitBtn && (submitBtn.disabled = true);

    try {
      await sendToTelegram({ name, phone, email, comment, page_url: pageUrl, page_title: pageTit });
      form.reset();
      openPopup('Thanks! Your message has been sent.');
      setTimeout(() => { closePopup(); }, 8000); // auto-close (adjust if needed)
    } catch (err) {
      console.error(err);
      openPopup('Submission failed. Please try again or call {{ site.phone | default: "" }}');
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });
}
