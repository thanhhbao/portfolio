const recipientEmail = 'thanhhbao4123@gmail.com'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const name = String(body?.name || 'Anonymous').slice(0, 120)
  const email = String(body?.email || '').slice(0, 160)
  const message = String(body?.message || '').slice(0, 4000)
  const mode = email ? 'email' : 'anonymous'

  if (!message.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _subject: 'New portfolio message',
      _template: 'table',
      _captcha: 'false',
      mode,
      name,
      email: email || 'Anonymous',
      message,
    }),
  })

  if (!response.ok) {
    return res.status(502).json({ error: 'Could not send message' })
  }

  return res.status(200).json({ ok: true })
}
