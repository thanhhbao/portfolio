const recipientEmail = 'thanhhbao4123@gmail.com'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body: Record<string, unknown>

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

  const payload = {
    _subject: 'New portfolio message',
    _template: 'table',
    _captcha: 'false',
    mode,
    name,
    email: email || 'Anonymous',
    message,
  }

  try {
    const formResponse = await fetch(`https://formsubmit.co/${recipientEmail}`, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload),
    })

    if (formResponse.ok || formResponse.status === 302) {
      return res.status(200).json({ ok: true })
    }

    const ajaxResponse = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (ajaxResponse.ok) {
      return res.status(200).json({ ok: true })
    }

    const detail = await ajaxResponse.text().catch(() => '')
    return res.status(502).json({
      error: 'Could not send message',
      detail: detail.slice(0, 240),
      status: ajaxResponse.status,
    })
  } catch (error) {
    return res.status(502).json({
      error: 'Could not reach mail service',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
