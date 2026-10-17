# quota-band

A Claude Code mod that pins your remaining subscription quota under the prompt:

```
quota-band  5h left 73% (resets 3h21m) · week left 61% (resets 2d17h)
```

- Reads the `five_hour` and `seven_day` rate-limit windows Claude Code already receives from each API response; no extra API calls, no credentials.
- Updates when a window moves a whole point, and refreshes the reset countdown every minute.
- Hidden until the first response of a session reports a reading. Shows nothing on API-key (non-subscription) usage.

## Install

At the prompt of a terminal session:

```
/plugin install quota-band --marketplace SodaSolas/claude-quota-band
```

Answer `y` to add the marketplace, then pick a scope (user scope loads it in every session, including the desktop app's Code tab).

From a shell:

```bash
claude plugin install quota-band --marketplace SodaSolas/claude-quota-band
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `SodaSolas/claude-quota-band`, then **Add plugin**.

## Develop

```bash
claude plugin validate .
claude plugin test .
```

## License

MIT
