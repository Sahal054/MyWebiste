import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
        if (!discordWebhookUrl) {
            console.error('DISCORD_WEBHOOK_URL is not configured.')
            return NextResponse.json({ error: 'Contact service is not configured.' }, { status: 503 })
        }

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

        const response = await fetch(discordWebhookUrl, {
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
