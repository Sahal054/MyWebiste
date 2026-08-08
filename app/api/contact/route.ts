import { NextResponse } from 'next/server'

const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1535763940834021459/wVCFocV9R1yl7W9ml6RQrItvsmG-oqqfhsh2HQA9bitUfassZfXlJa9cBi6jQWEeyZ1T'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const email = typeof body?.email === 'string' ? body.email.trim() : ''
        const message = typeof body?.message === 'string' ? body.message.trim() : ''

        if (!message) {
            return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
        }



        const payload = {
            embeds: [
                {
                    title: 'Website Contact Submission',
                    color: 0x111827,
                    fields: [
                        {
                            name: 'Email',
                            value: email || 'Not provided',
                            inline: false,
                        },
                        {
                            name: 'Message',
                            value: message.slice(0, 1024),
                            inline: false,
                        },
                    ],
                    footer: {
                        text: 'Submitted from the portfolio site',
                    },
                    timestamp: new Date().toISOString(),
                },
            ],
        }

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to forward contact submission.' }, { status: 502 })
        }

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }
}
