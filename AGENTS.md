# AGENTS.md

Istruzioni per chiunque (umano o agente) lavori su questo repo: fork del plugin Obsidian "Vault Statistics", mantenuto da ARME a partire da `bkyle/obsidian-vault-statistics-plugin`.

## Contesto

- Plugin Obsidian in TypeScript: una voce nella status bar con note, allegati, file, link, parole e dimensione del vault.
- Repo pubblicata come plugin beta e installata via BRAT dal fork `ALE-ARME/obsidian-vault-statistics-plugin`.
- `origin` = fork `ALE-ARME` (dove si pusha), `upstream` = `bkyle` (sorgente originale, solo per sincronizzazioni manuali).
- `main.js` è un artefatto di build, non versionato: le release lo allegano come asset.

## Comandi

```bash
npm install       # dipendenze
npm run dev       # rollup in watch, ricompila main.js a ogni salvataggio
npm test          # jest (src/text.spec.ts)
npm run build     # build una tantum
npm run deploy    # build + copia main.js, manifest.json, styles.css nel vault
```

`npm run deploy` risolve la destinazione in questo ordine: variabile d'ambiente `PLUGIN_DIR`, `pluginDir` in `deploy.local.json` (non versionato, contiene il path del vault locale), altrimenti `.sandbox/.obsidian/plugins/obsidian-vault-statistics-plugin`.

## Regole di build (non negoziabili)

- `tsconfig.json` deve restare su `target: "es2018"` (o superiore) e `lib` coerente. Con `es5` TypeScript trasforma `class X extends Plugin` in una chiamata al costruttore nativo di Obsidian e il plugin non si carica: `TypeError: Class constructor cannot be invoked without 'new'`. È il bug che ha motivato questa fork: non tornare mai a `es5`.
- `@rollup/plugin-typescript` deve restare >= 8: la v6 non applica più la trasformazione TS con le versioni attuali di rollup e la build fallisce con `Unexpected token` sul primo tipo TypeScript.
- Non aggiungere `"type": "module"` a `package.json`: `rollup.config.js` usa già ESM e viene caricato da rollup.
- Il bundle finale deve contenere classi native e terminare con `module.exports = StatisticsPlugin`.

## Rilascio

```bash
npm test
npm version patch        # oppure minor / major
git push --follow-tags
```

- `npm version` aggiorna `package.json`, poi lo script `version` esegue `version-bump.mjs` (allinea `manifest.json` e aggiunge la voce in `versions.json`) e crea commit + tag.
- Il tag deve essere `x.y.z` **senza prefisso `v`**: `.github/workflows/release.yml` verifica che coincida con `manifest.json` e fallisce se non combacia.
- Il tag fa partire il workflow che esegue test e build e allega `main.js`, `manifest.json`, `styles.css` alla release. Non creare release a mano e non caricare zip: BRAT e Obsidian usano solo quei tre asset.
- Prima del rilascio aggiornare la sezione "Version History" del `README.md`.

## Manifest e metadati

- `manifest.json`: `id` `obsidian-vault-statistics-plugin` (deve combaciare col nome della cartella in `.obsidian/plugins/`), `author` `ARME`, `authorUrl` e `repo` puntati al fork. Non cambiare l'`id`: romperebbe installazioni e impostazioni esistenti.
- `versions.json` mappa versione plugin → `minAppVersion`. Va aggiornato insieme al manifest, meglio lasciarlo fare a `version-bump.mjs`.
- La cartella del plugin nel vault deve chiamarsi `obsidian-vault-statistics-plugin`, altrimenti `id` e cartella non coincidono e Obsidian non carica il plugin.

## Aggiornare il plugin nel vault

- Sviluppo: `npm run deploy`, poi in Obsidian un comando di reload plugin (o riavvio).
- Rilascio: dopo che la release è online, in Obsidian `Plugins: Check for updates to all beta plugins and UPDATE` (BRAT), oppure riavvio con `updateAtStartup` attivo.
- Il repo è registrato in `.obsidian/plugins/obsidian42-brat/data.json` → `pluginList` come `ALE-ARME/obsidian-vault-statistics-plugin`. BRAT deve restare abilitato, altrimenti gli aggiornamenti automatici non partono.

## Debug nel vault

Se il plugin non appare nella status bar, gli errori veri stanno nella console di Obsidian (Ctrl+Shift+I), non nell'interfaccia. Con il plugin Copilot si può leggere la console via `dev:cdp` (`Runtime.evaluate`) senza aprire i DevTools. Controllare nell'ordine: presenza della cartella del plugin, `manifest.json` valido, errore di caricamento in console.

## Cosa non fare

- Non committare `main.js`, `node_modules`, `package-lock.json` o `deploy.local.json`.
- Non rinominare o spostare il plugin nel vault senza motivo.
- Non aggiungere chiamate di rete o telemetria: il plugin elabora i file del vault solo in locale.
- Non toccare `data.json` del plugin nel vault (impostazioni utente) durante lo sviluppo.
- Non fare `git push` su `upstream`: le modifiche vivono solo sul fork.
