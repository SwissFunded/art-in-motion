export default async function handler(req: any, res: any) {
  if (req.method && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const {
      artworkId,
      artworkName,
      fromPath,
      toPath,
      userEmail,
      userName,
      whenISO,
    } = body || {};

    if (!artworkId || !toPath) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const slackWebhook = process.env.SLACK_WEBHOOK_URL || '';
    const tgToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const tgChat = process.env.TELEGRAM_CHAT_ID || '';
    const resendKey = process.env.RESEND_API_KEY || '';
    const emailTo = process.env.NOTIFY_EMAIL_TO || '';
    const emailFrom = process.env.NOTIFY_EMAIL_FROM || '';

    const title = `Artwork moved: ${artworkName || artworkId}`;
    const by = userEmail || userName ? ` by ${userName || userEmail}` : '';
    const when = whenISO ? new Date(whenISO).toLocaleString() : new Date().toLocaleString();
    const text = [
      `${title}${by}`,
      fromPath ? `From: ${fromPath}` : undefined,
      `To: ${toPath}`,
      `When: ${when}`,
      `ID: ${artworkId}`,
    ].filter(Boolean).join('\n');

    const results: any = {};

    // Fan-out to all configured channels (non-blocking per channel)
    const tasks: Promise<void>[] = [];

    if (slackWebhook) {
      tasks.push(
        fetch(slackWebhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ text }),
        })
          .then(async (r) => { results.slack = { ok: r.ok, status: r.status }; })
          .catch((e) => { results.slack = { ok: false, error: String(e?.message || e) }; })
      );
    }

    if (tgToken && tgChat) {
      const tgUrl = `https://api.telegram.org/bot${tgToken}/sendMessage`;
      const tgBody = { chat_id: tgChat, text, parse_mode: 'HTML' };
      tasks.push(
        fetch(tgUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(tgBody),
        })
          .then(async (r) => { results.telegram = { ok: r.ok, status: r.status }; })
          .catch((e) => { results.telegram = { ok: false, error: String(e?.message || e) }; })
      );
    }

    if (resendKey && emailTo && emailFrom) {
      const emailPayload = {
        from: emailFrom,
        to: [emailTo],
        subject: title,
        text,
      };
      tasks.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify(emailPayload),
        })
          .then(async (r) => { results.email = { ok: r.ok, status: r.status }; })
          .catch((e) => { results.email = { ok: false, error: String(e?.message || e) }; })
      );
    }

    if (tasks.length === 0) {
      res.status(400).json({ error: 'No notification channels configured' });
      return;
    }

    await Promise.allSettled(tasks);
    res.status(200).json({ ok: true, results });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}


