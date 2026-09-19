import { NextResponse } from 'next/server'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const submissionsByClient = new Map<string, number[]>()

function getClientKey(request: Request): string {
    const forwardedFor = request.headers.get('x-forwarded-for')
    if (forwardedFor) return forwardedFor.split(',')[0].trim()
    return request.headers.get('x-real-ip') ?? 'unknown'
}

function getRateLimitState(clientKey: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now()
    const recentSubmissions = (submissionsByClient.get(clientKey) ?? [])
        .filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS)

    if (recentSubmissions.length >= RATE_LIMIT_MAX) {
        const retryAfterSeconds = Math.ceil((recentSubmissions[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)
        submissionsByClient.set(clientKey, recentSubmissions)
        return { allowed: false, retryAfterSeconds }
    }

    recentSubmissions.push(now)
    submissionsByClient.set(clientKey, recentSubmissions)
    return { allowed: true, retryAfterSeconds: 0 }
}

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

        const rateLimit = getRateLimitState(getClientKey(request))
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many messages. Please try again later.' },
                {
                    status: 429,
                    headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
                }
            )
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
