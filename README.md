# GhostKey

> the mission control layer for AI delegation

## Why use it

Every company wants AI agents to do real work — and every security team is terrified because today that means handing the agent a refresh token, an API key, or a browser session that can act as you long after the task is over.

That’s broken. A prompt injection shouldn’t become an insider threat. A travel bot shouldn’t inherit your whole calendar. A support agent shouldn’t keep refund power after the refund is done.

We built **GhostKey**: the mission control layer for AI delegation. A human creates one bounded mission — “refund this order up to $50,” “draft one invoice,” “open one support case” — and GhostKey gives the agent a single-use slice of authority. The mission is sealed, spent once, and then the screen proves reuse is rejected. The model never sees a reusable account credential, because there isn’t one.

The Tide edge is why this is possible. We use TideCloak login so the human proves identity without becoming a password database. We use Tide self-encryption to seal mission instructions client-side, so even our app can’t read the user’s sensitive task text at rest. And the product is designed around Tide delegation and policy primitives: a Doken-style capability is the thing an agent spends, while a Forseti-style policy says what that capability is allowed to do. Without Tide, you’re back to bearer tokens and trust-me audit logs. With Tide, authority is cryptographic, scoped, and disposable.

The buyers are every enterprise adopting Operator-style agents, Slack bots, Zapier automations, CRMs, ticketing systems, and internal copilots. They’re all blocked by the same question: “What credential are we giving the bot?” GhostKey changes the answer to: none — you’re lending a task, not your identity.

## What it is

A [Next.js](https://nextjs.org) app secured with [TideCloak](https://tidecloak.com) — decentralized identity where keys are split across a network, so **no single server (not even this app) ever holds a usable copy**. Login, sessions, and the app's sensitive data are protected by that model.

## Prerequisites

- **Node.js 20+**
- **Docker** (to run TideCloak locally)
- **`jq`** and **`curl`** (used by the init script)

## Run it locally

**1. Start TideCloak** (the public dev image — has a pre-configured entrypoint, do *not* append `start-dev`):

```bash
docker run -d --name tidecloak -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  tideorg/tidecloak-dev:latest

# wait until it answers:
until curl -sf http://localhost:8080 >/dev/null; do sleep 3; done
```

**2. Install and initialise** (the init script wires up TideCloak — see below):

```bash
cd app
npm install
npm run init
```

**3. Start the app:**

```bash
npm run dev
```

Open **http://localhost:3000**.

## Initialising TideCloak (what `npm run init` does)

`npm run init` runs [`init/tcinit.sh`](app/init/tcinit.sh) against your local TideCloak and:

- creates the **`nextjs-test`** realm and the **`myclient`** client,
- enables the **Tide IdP** and **IGA** (identity governance),
- creates an **`admin`** user and prints an account-link invite,
- writes the adapter config to **`tidecloak.json`**, which the app reads.

TideCloak admin console: **http://localhost:8080** (`admin` / `password`).

## Using it

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

---

Built on [TideCloak](https://tidecloak.com). The product story is in **[pitch.md](pitch.md)**.
