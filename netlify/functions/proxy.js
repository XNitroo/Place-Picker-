// netlify/functions/proxy.js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4hhNK1tEx2E1Us-EdgemK4W-wgaCl6jhQyXs7P05V5RFAvcPE6NBys32svUoGMPqO/exec';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async function(event, context) {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const place = body.place || '';
    const user = body.user || '';
    const note = body.note || '';

    const resp = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ __token: process.env.BDAY_SECRET, place, user, note })
    });

    const text = await resp.text();
    return { statusCode: resp.status || 200, headers: CORS_HEADERS, body: text };
  } catch (err) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ ok:false, error: err.message }) };
  }
};
