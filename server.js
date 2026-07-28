import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
app.use(cors());
app.use(express.json());

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// GET — Read all data from Google Sheet
app.get('/api/sheet', async (req, res) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth: getAuth() });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

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

    console.log(`[GET] Loaded ${Object.keys(data).length} keys from Sheet`);
    res.json(data);
  } catch (error) {
    console.error('[GET] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST — Save a key-value pair to Google Sheet
app.post('/api/sheet', async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'Missing "key"' });

    const sheets = google.sheets({ version: 'v4', auth: getAuth() });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Read existing rows to find the key
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'SiteData!A:B',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(([k]) => k === key);

    if (rowIndex >= 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `SiteData!B${rowIndex + 1}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[JSON.stringify(value)]] },
      });
      console.log(`[POST] Updated key: ${key}`);
    } else {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'SiteData!A:B',
        valueInputOption: 'RAW',
        requestBody: { values: [[key, JSON.stringify(value)]] },
      });
      console.log(`[POST] Appended key: ${key}`);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('[POST] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🔥 API server running on http://localhost:${PORT}`);
  console.log(`   Sheet ID: ${process.env.GOOGLE_SHEET_ID || 'NOT SET'}`);
  console.log(`   Service Account: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'NOT SET'}\n`);
});
