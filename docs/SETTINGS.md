# Akari Lanterns Settings And Operations

Last updated: 2026-05-06

## Public URL

`https://webgame.beta.menu/akari/`

## Cloudflare

- Account: `ZED Playground`
- Account ID: `524c8bd900e5189c6a55d88f45e0f2a0`
- Worker: `webgame-akari`
- Route: `webgame.beta.menu/akari/*`

## Deployment Directory

```text
dist/akari/
```

## Deploy

```sh
rtk proxy cp -X index.html style.css app.js dist/akari/
rtk proxy find dist -name '._*' -delete -o -name '.DS_Store' -delete
rtk npx --yes wrangler deploy
```
