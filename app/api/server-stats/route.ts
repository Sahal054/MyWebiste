import { NextResponse } from 'next/server'
import os from 'os'

async function getCpuUsagePercent(): Promise<number> {
    return new Promise((resolve) => {
        const start = os.cpus().map((cpu) => ({
            total: Object.values(cpu.times).reduce((a, b) => a + b, 0),
            idle: cpu.times.idle,
        }))

        // Sample over 200ms for an accurate reading
        setTimeout(() => {
            const end = os.cpus()
            let totalDiff = 0
            let idleDiff = 0
            end.forEach((cpu, i) => {
                const endTotal = Object.values(cpu.times).reduce((a, b) => a + b, 0)
                totalDiff += endTotal - start[i].total
                idleDiff += cpu.times.idle - start[i].idle
            })
            resolve(totalDiff === 0 ? 0 : ((1 - idleDiff / totalDiff) * 100))
        }, 200)
    })
}

export async function GET() {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const cpus = os.cpus()
    const [load1, load5] = os.loadavg()
    const cpuUsage = await getCpuUsagePercent()

    return NextResponse.json({
        memory: {
            total:   (totalMem / 1024 ** 3).toFixed(2),
            used:    (usedMem  / 1024 ** 3).toFixed(2),
            free:    (freeMem  / 1024 ** 3).toFixed(2),
            percent: ((usedMem / totalMem) * 100).toFixed(1),
        },
        cpu: {
            model:       cpus[0]?.model.split('@')[0].trim() ?? 'Unknown',
            cores:       cpus.length,
            loadAvg1m:   load1.toFixed(2),
            loadAvg5m:   load5.toFixed(2),
            usagePercent: cpuUsage.toFixed(1),
        },
        uptime:   Math.floor(os.uptime()),
        hostname: os.hostname(),
        platform: os.platform(),
    })
}
