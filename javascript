const express = require('express');
const { google } = require('googleapis');
const app = express();

app.get('/get-promo-code', async (req, res) => {
    try {
        const sheets = google.sheets({ version: 'v4', auth: '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' });
        const spreadsheetId = '1b-EbPHOLE7XESBFG1ANYLWhFNjG_a-Y-fPzlPgbRo0c';

        // 從Google Sheets讀取數據
        const range = 'Sheet1!A:B';
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        const rows = response.data.values;
        const availableCode = rows.find(row => row[1] !== 'TRUE');

        if (availableCode) {
            // 將Promo code發送到前端
            res.json({ promoCode: availableCode[0] });

            // 標記Promo code為已使用
            const updateRange = `Sheet1!B${rows.indexOf(availableCode) + 1}`;
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: updateRange,
                valueInputOption: 'RAW',
                resource: { values: [['TRUE']] },
            });
        } else {
            res.json({ promoCode: null });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
