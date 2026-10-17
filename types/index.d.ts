export type Window = { percentUsed: number; resetsAt?: string }
export type Quota = { fiveHour: Window | null; sevenDay: Window | null }

declare module 'claude-code' {
  interface PluginState {
    'quota-band': { quota: Quota }
  }
}
