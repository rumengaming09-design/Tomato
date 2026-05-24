Export default async function handler(req, res) {
  If (req.method !== ‘POST’) {
    Return res.status(405).json({ message: ‘Method not allowed’ });
  }

  Const { name, phone, guests, dateTime, location } = req.body;

  Const token = process.env.TELEGRAM_BOT_TOKEN;
  Const chatId = process.env.TELEGRAM_CHAT_ID;

  If (!token || !chatId) {
    Return res.status(500).json({ error: ‘Липсва конфигурация на Telegram на сървъра.’ });
  }

  Const zones = { hall: ‘Основна зала’, garden: ‘Градина’, bar: ‘Бар’ };
  Const selectedZone = zones[location] || location;

  Const message = `
🔔 *НОВА РЕЗЕРВАЦИЯ В TOMATO!*

👤 *Име:* ${name}
📞 *Телефон:* ${phone}
👥 *Брой гости:* ${guests}
📅 *Дата и Час:* ${dateTime}
📍 *Зона:* ${selectedZone}

💬 *Статус:* Изчаква преглед в таблото
  `.trim();

  Try {
    Const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      Method: ‘POST’,
      Headers: { ‘Content-Type’: ‘application/json’ },
      Body: JSON.stringify({
        Chat_id: chatId,
        Text: message,
        Parse_mode: ‘Markdown’,
      }),
    });

    If (!telegramRes.ok) {
      Throw new Error(‘Грешка при изпращането към Telegram API’);
    }

    Return res.status(200).json({ success: true });
  } catch (error) {
    Console.error(error);
    Return res.status(500).json({ error: ‘Възникна грешка при изпращане.’ });
  }
}


