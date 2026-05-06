# Akari Lanterns

Static Light Up / Akari-style puzzle for `webgame.beta.menu/akari/`.

## Play

Open `index.html` locally, or use:

```text
https://webgame.beta.menu/akari/
```

## Deploy

```sh
rtk proxy cp -X index.html style.css app.js dist/akari/
rtk proxy find dist -name '._*' -delete -o -name '.DS_Store' -delete
rtk npx --yes wrangler deploy
```
