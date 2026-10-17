import { expect, test } from 'claude-code/testing'

import { describe, toQuota } from './register'

test('picks five_hour and seven_day and shows what is left', () => {
  const now = Date.parse('2026-10-17T10:00:00Z')
  const q = toQuota([
    { kind: 'five_hour', percentUsed: 23.5, resetsAt: '2026-10-17T12:30:00Z' },
    { kind: 'seven_day', percentUsed: 60, resetsAt: '2026-10-20T13:00:00Z' },
    { kind: 'spend_limit', percentUsed: 5 },
  ])
  expect(describe(q, now)).toBe('5h left 76.5% (resets 2h30m) · week left 40% (resets 3d3h)')
})

test('a missing window shows a dash', () => {
  expect(describe(toQuota([{ kind: 'seven_day', percentUsed: 120 }]), 0)).toBe('5h left — · week left 0%')
})
