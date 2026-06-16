## What it is

GhostKey is a TideCloak-powered MVP for delegating one bounded AI-agent mission without handing the agent a reusable credential. A user signs in with Tide, creates a scoped mission, seals the mission instructions with Tide self-encryption, sees the agent spend the authority once, and sees a replay rejected state.

## How to run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. TideCloak is expected to be running and the adapter is provided in both `app/tidecloak.json` and `app/data/tidecloak.json`.

## Pages & features

- `/` — branded GhostKey cover/login page with “Continue with Tide”.
- `/home` — mission-control dashboard with product navigation and live mission count.
- `/missions` — create a one-use agent mission. Submit calls Tide `doEncrypt`, immediately calls `doDecrypt`, stores only ciphertext in browser localStorage, and renders the spent-once plus replay-rejected proof.
- `/proof` — opens the latest sealed mission proof. Submit decrypts the owner-only ciphertext and calls `/api/protected` with the Tide token so the server verifies the authenticated session.

## What's mocked vs real

Real:

- TideCloak login via `useTideCloak().login()`.
- Tide self-encryption / self-decryption in the mission and proof form flows.
- Server-side Tide JWT verification in `/api/protected` using the embedded adapter JWK.
- DPoP is explicitly disabled in `app/app/layout.tsx` for this MVP because the automated walkthrough browser blocks the third-party IndexedDB/storage-access handoff used by Tide's default DPoP front-channel page. GhostKey does not claim DPoP as a shipped primitive in this demo.

Mocked / declared:

- The Doken-like mission receipt (`doken-demo:*`) is a local capability receipt for the demo UI, not a real Tide Doken issued by ORKs.
- The Forseti-style rule (“one spend, then reject replay”) is enforced in local demo state, not an ORK-executed contract. The UI declares this as the target policy behavior for the pitch.
