import { google } from 'googleapis';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));

  try {
    const sheets = google.sheets({ version: 'v4', auth: getAuth() });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (req.method === 'GET') {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'SiteData!A:B',
      });

      const rows = response.data.values || [];
      const data = {};
      for (const [key, value] of rows) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { key, value } = req.body;

      if (!key) {
        return res.status(400).json({ error: 'Missing "key" in request body' });
      }

      // Read existing rows to find the key
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'SiteData!A:B',
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(([k]) => k === key);

      if (rowIndex >= 0) {
        // Update existing row
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `SiteData!B${rowIndex + 1}`,
          valueInputOption: 'RAW',
          requestBody: { values: [[JSON.stringify(value)]] },
        });
      } else {
        // Append new row
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'SiteData!A:B',
          valueInputOption: 'RAW',
          requestBody: { values: [[key, JSON.stringify(value)]] },
        });
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Sheet API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
