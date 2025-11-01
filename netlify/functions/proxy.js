// netlify/functions/proxy.js
// Use global fetch (Netlify modern runtimes provide fetch)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4hhNK1tEx2E1Us-EdgemK4W-wgaCl6jhQyXs7P05V5RFAvcPE6NBys32svUoGMPqO/exec';


exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const place = body.place || '';
    const user = body.user || '';
    const note = body.note || '';

    // Forward to Apps Script with secret server-side
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ __token: process.env.BDAY_SECRET, place, user, note })
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { 'Content-Type': 'text/plain' },
      body: text
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error: err.message }) };
  }
};
