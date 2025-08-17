export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST allowed" });
    }

    const { location, date, time, contact } = req.body; // 🔥 contact eklendi

    const botToken = process.env.BOT_TOKEN;
    const chatId = process.env.CHAT_ID;

    const message = `Buluşma Yeriniz: ${location}\nTarih: ${date}\nSaat: ${time}\nİletişim: ${contact}`; // 🔥 contact mesajda

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ error: data });
        }
    } catch (err) {
        return res.status(500).json({ error: err.toString() });
    }
}
