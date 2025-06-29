const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// ✅ Data akses Zuwinda kamu
const ACCESS_KEY = 'e5e9312e608d6f73ab913c85c3b007b6';
const ACCOUNT_ID = '5e28c4d2-56fb-4a43-b974-b3ebd04254f1';

app.get('/', (req, res) => {
  res.send('✅ Zappio Bot is running!');
});

app.post('/', async (req, res) => {
  try {
    const body = req.body;
    console.log('📦 Webhook diterima:\n', JSON.stringify(body, null, 2));

    const sender = body.from;
    const message = body.text?.body?.toLowerCase() || '[pesan kosong]';

    console.log(`📥 Pesan dari ${sender}: "${message}"`);

    // ✅ Jika customer kirim salam (Hi, Hallo, Halo, dll)
    const salamKeywords = ['hi', 'halo', 'hallo', 'hay', 'hello', 'assalamualaikum'];

    if (salamKeywords.some(kata => message.includes(kata))) {
      const reply = `Hallo kak, selamat datang di *Zappio Premium!* 👋🏻
Kami menyediakan layanan aplikasi premium dengan harga terjangkau.

Silakan ketik angka sesuai produk:
1. Netflix Premium
2. CapCut Pro
... (isi sendiri)

00. 🔄 Layanan 40+ Aplikasi lainnya (Proses via Admin)
0. 👤 Chat Admin langsung
99. ❌ Batal / Kembali`;

      await axios.post('https://api.zuwinda.com/v2/messaging/whatsapp/message', {
        to: sender,
        messageType: 'text',
        content: reply,
        whatsapp_account_id: ACCOUNT_ID
      }, {
        headers: {
          'x-access-key': ACCESS_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Balasan salam berhasil dikirim ke:', sender);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error saat kirim balasan:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Zappio Bot running at http://localhost:${PORT}`);
});
