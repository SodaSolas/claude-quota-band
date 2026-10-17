import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionRateLimit } from 'claude-code'

import type { Quota, Window } from '../types'

const quota = atom({ plugin: 'quota-band', key: 'quota' } as const, { fiveHour: null, sevenDay: null })

const pick = (limits: SessionRateLimit[], kind: string): Window | null => {
  const w = limits.find(l => l.kind === kind)
  return w ? { percentUsed: w.percentUsed, resetsAt: w.resetsAt } : null
}

export const toQuota = (limits: SessionRateLimit[]): Quota => ({
  fiveHour: pick(limits, 'five_hour'),
  sevenDay: pick(limits, 'seven_day'),
})

const left = (w: Window | null) => (w ? `${Math.max(0, Math.round((100 - w.percentUsed) * 10) / 10)}%` : '—')

const resetIn = (w: Window | null, now: number) => {
  if (!w?.resetsAt) return ''
  const mins = Math.max(0, Math.round((Date.parse(w.resetsAt) - now) / 60000))
  if (mins >= 1440) return ` (resets ${Math.floor(mins / 1440)}d${Math.floor((mins % 1440) / 60)}h)`
  return ` (resets ${Math.floor(mins / 60)}h${mins % 60}m)`
}

export const describe = (q: Quota, now: number) =>
  `5h left ${left(q.fiveHour)}${resetIn(q.fiveHour, now)} · week left ${left(q.sevenDay)}${resetIn(q.sevenDay, now)}`

async function show($: EngineInterface) {
  const q = await read($, quota)
  $.ui.status(q.fiveHour || q.sevenDay ? describe(q, await $.clock.now()) : undefined)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const { rateLimits } = await $.session.usage()
    await update($, quota, () => toQuota(rateLimits))
    await show($)
    $.clock.every(60_000, () => show($))
    return result
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      await update($, quota, () => toQuota(e.rateLimits))
      await show($)
    }
    return next(e)
  })
}
