const recipientEmail = 'thanhhbao4123@gmail.com'

type ContactBody = {
  name?: string
  email?: string
  message?: string
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    return res.status(500).json({
      error: 'Contact form is not configured yet.',
      detail: 'Missing WEB3FORMS_ACCESS_KEY in Vercel environment variables.',
    })
  }

  let body: ContactBody

  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  const name = String(body?.name || 'Anonymous').slice(0, 120)
  const email = String(body?.email || '').slice(0, 160)
  const message = String(body?.message || '').slice(0, 4000)
  const mode = email ? 'email' : 'anonymous'

  if (!message.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: 'New portfolio message',
      from_name: name,
      email: email || recipientEmail,
      replyto: email || recipientEmail,
      to: recipientEmail,
      name,
      contact_mode: mode,
      message,
    }),
  })

  const result = await response.json().catch(() => null)

  if (!response.ok || result?.success === false) {
    return res.status(502).json({
      error: 'Could not send message',
      detail: result?.message || 'Mail service rejected the request.',
    })
  }

  return res.status(200).json({ ok: true })
}
