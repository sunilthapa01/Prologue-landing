# Prologue — Complete Product Overview

> Everything you need to know about the product, how it works, what it looks like, who it's for, and where it's going. Use this as the source-of-truth document for building the website.

---

## 1. What Prologue Is

Prologue is an interactive visual learning platform. A student types any concept they don't understand — in any subject, at any grade — and the platform instantly generates a live, interactive visual they can touch, drag, and manipulate until the idea clicks.

Not a video. Not a chatbot. Not a wall of text. A working, responsive environment where the concept comes to life and the student controls it.

**The product name is "Prologue."** The internal codename is "Visual Learn." The app title displayed in-app is "Prologue."

### The Core Interaction (an example)

A student types: *"I don't understand what a derivative means."*

The platform generates a coordinate plane with a curve drawn on it. There's a draggable point on the curve. As the student drags the point, a tangent line follows in real time. The slope readout updates live. The student doesn't just see what a derivative is — they feel it behave.

That's the product in one sentence: **understand anything by touching it.**

---

## 2. The Problem

Most students don't fail because they aren't trying. They fail because nobody ever showed them what the concept actually looks like.

- A textbook explains photosynthesis in three paragraphs.
- A teacher draws a diagram on a whiteboard.
- A YouTube video plays for six minutes.

And the student still doesn't *get it* — because none of those things let them touch it, move it, or break it apart themselves.

ChatGPT and other AI tools made this worse in a different way. Now a student can get the answer in seconds without understanding a single step that led to it. Schools are right to be worried. But banning AI isn't the answer. Building the right kind of AI is.

### The Cognitive Gap

There's a profound difference between memorizing the steps to compute a formula and developing an intuitive "feel" for how the underlying concept behaves. Traditional learning requires students to mentally simulate motion and outcome based on static text or lifeless infographics. That's an enormous cognitive burden — and most students break under it.

Interactive visuals eliminate this tax by shifting the burden of interpretation from the student to the platform. The concept demonstrates itself through motion, manipulable controls, and adaptive labeling. The student explores instead of imagines.

---

## 3. What Makes Prologue Different

### "We don't solve problems. We make students understand them."

This is the fundamental distinction that separates Prologue from every other AI tool in education.

- **ChatGPT** gives you the answer.
- **Prologue** gives you the understanding.

A student cannot cheat their way through an exam by knowing what a concept looks like — they still have to solve it themselves. This isn't just a moral position. It's the architectural foundation of the product. The platform is **structurally incapable of academic dishonesty** because it never completes the student's work. It only illuminates the idea behind it.

For a school administrator — under intense pressure from parents and boards to justify every screen students stare at — this is the answer they've been looking for. Active, measurable, pedagogically sound AI use. Not passive consumption. Not a shortcut machine.

### Competitive Positioning

| Platform | What they do | Prologue's edge |
|----------|-------------|-----------------|
| **Brilliant.org** | Guided courses, curated content | We're open-ended — any concept, any time |
| **Khan Academy** | Video + exercises | We're interactive, not passive |
| **PhET** | Pre-built simulations (finite library) | We generate on-demand with AI — infinite concepts |
| **ChatGPT / Gemini** | Gives answers as text | We build understanding through manipulation, never answers |
| **TeachBetter.ai** | 100+ pre-built simulations | We generate new, custom visuals on-the-fly per query |

### The Key Structural Advantage

Prologue's core output is **self-contained HTML/JavaScript**. Every visual the AI generates is a complete, working web application — it runs natively in any browser, any WebView, any device. This means:

- Visuals load offline once cached
- Every cached visual can become an SEO-indexable web page
- Students searching "photosynthesis interactive" on Google can land directly on a working visual
- Teachers can share direct links to interactive homework

This is not a port. The browser is the product's natural habitat.

---

## 4. How It Works — End to End

### The Core Loop

```
Student types a concept
        │
        ▼
Check local cache (Hive, on-device) → HIT? Render instantly (<50ms)
        │ MISS
        ▼
Send to Supabase Edge Function (/generate-visual)
        │
        ▼
Step 1: Claude Haiku — classify safety + normalize concept
        │
        ├── BLOCKED → log to audit trail → return safe message
        │
        └── ALLOWED → check PostgreSQL cache
                │
                ├── CACHE HIT → return HTML (<300ms, ~$0.0004)
                │
                └── CACHE MISS → Claude Sonnet generates interactive HTML
                        │
                        ▼
                Store in database + return to app
                        │
                        ▼
                Render in WebView (or iframe on web)
                        │
                        ▼
                Student interacts → telemetry flows
```

### What the AI Actually Generates

Each visual is a fully self-contained HTML document with:
- Inline CSS and JavaScript (no external dependencies)
- At least one interactive element (slider, draggable point, toggle, or button)
- Real-time feedback — all changes happen live, no submit buttons
- Touch-optimized interactions (44px minimum touch targets)
- A short title (max 6 words) and one instruction sentence
- Built-in telemetry that fires interaction events back to the app
- Grade-appropriate complexity (simpler for Grade 6–8, full notation for Grade 9–12+)

### The Explanation Layer

Every visual ships with a companion explanation — 3–5 sentences generated in the same AI call. This is not a textbook definition. It's a guided tour of the specific visual: "The blue slider controls the radius. Drag it and watch the area formula update in real time. Try setting it to zero and notice what happens."

### The Q&A Box

Below every visual, there's a persistent "Ask about what you see..." input. Students can ask follow-up questions about the visual they're looking at. A lightweight AI call (Claude Haiku) answers in 2–4 sentences, grounded in the actual visual — referencing specific sliders, colors, and labels. Stateless per question. Never gives away the answer.

### Streaming Generation

When a concept isn't cached, the AI generates the visual via Server-Sent Events (SSE) streaming. The student watches the visual build itself in real-time — HTML appears progressively in the WebView as the model writes it. This turns waiting time into engagement.

---

## 5. The Learning Framework

### Human → AI → Human

Every session follows the same principle:

1. The **student** initiates with genuine curiosity (types a question)
2. The **AI** responds with a visual environment
3. The **student** completes the loop by interacting, reasoning, and concluding on their own

The AI never closes the loop for the student. It holds the door open.

### Predict-Then-Check

Before a visual snaps into its final state, the student is asked to predict what will happen. Where will the regression line fall? Which side of the equilibrium will shift? The student commits to an answer by manipulating a ghost element on the canvas, then the AI reveals the truth. This forces active reasoning and dramatically improves retention.

### Scaffolded Fading

Early interactions offer more guided prompts. As a student's history shows growth in a topic, the platform quietly reduces the scaffolding — asking the student to reason independently before offering a hint. Support is present when needed and absent when it isn't.

\


## 8. Caching — Why Most Requests Are Free

Prologue has a four-layer caching architecture that drives per-student costs to near zero:

### Layer 1: Local Hive Cache (fastest)
Last 60 visuals the student accessed are stored on-device. Returning to a previously seen concept loads in under 50ms. Works fully offline.

### Layer 2: PostgreSQL Cache (primary)
Every generated visual is stored in the database, keyed by SHA-256 hash of `normalizedLabel + gradeBand + subject`. Any student anywhere who asks for the same concept gets the cached visual instantly. Cache invalidation: never automatic — academic concepts don't change.

### Layer 3: Anthropic Prompt Caching
The system prompt exceeds 1,000 tokens. Anthropic's native prompt caching processes it once per 5-minute window. All subsequent calls within that window pay only for the new tokens. Reduces per-call cost by 40–60%.

### Layer 4: Predictive Pre-Caching
On app launch over WiFi, the app silently pre-generates the top 30 concepts for the student's grade and subjects. Most Grade 10 Math students ask about the same 15–20 concepts. Generate them before they need them.

### Cost Architecture

| Scenario | Cost |
|----------|------|
| New concept (first-ever generation) | ~$0.027 |
| Cached concept (any student, any device) | ~$0.0004 (Haiku classify only) |
| Local cache hit (same device) | $0.00 |
| Q&A follow-up question | ~$0.0003 per question |

**Projection for first 500 users:** Monthly API cost under $50. Cache hit rate above 85% after month 1.

---

## 9. Content Moderation & Safety

### Why It Can't Be Skipped

One student getting an off-topic or harmful response and screenshotting it ends a district deal. This is a procurement requirement, not a nice-to-have.

### How It Works

Every student input passes through a single Claude Haiku call (`classifyAndNormalize`) before any visual generation happens. This call:
- Classifies whether the input is safe and educational
- Normalizes the concept to a canonical academic label
- Returns a SHA-256 hash for cache lookup

If blocked, the request is logged to a `blocked_requests` audit table — when a district asks "what happens if a student misuses this?", you show them the log.

### What Gets Blocked
- Harmful or dangerous content
- Requests for homework solutions (seeking the answer, not the concept)
- Personal advice or non-academic topics
- Prompt injection attempts
- Anything unrelated to academic learning

### What Does NOT Get Blocked
History of wars and atrocities, chemistry reactions, human biology, controversial historical movements, social issues studied in school. Over-blocking destroys the product's usefulness.

---

## 10. All Features (Built and Planned) Mobile
### Fully Functional Right Now ✅

1. **Onboarding** — 13-page conversational flow. Collects name, grade, board (CBSE, AP, Common Core, General), subjects, hardest subject, learning style, frustration, and demo reaction. Live demo visual on screen 9 is the "wow moment." Persisted locally in Hive.

2. **Authentication** — Supabase email/password auth. Magic link support.

3. **Search → Generate → Session** — Full AI pipeline. Type any concept → Haiku classifies → Sonnet generates → WebView renders. SSE streaming for live generation visualization.

4. **Visual Session** — Three-layer screen: explanation panel (guided tour), interactive WebView (the visual), and Q&A box (follow-up questions).

5. **Ask Anything (Q&A)** — Real Claude Haiku calls grounded in the specific visual the student is looking at.

6. **History** — Reads from Hive cache. Tap to reopen any previously explored visual.

7. **Telemetry** — Session-level interaction tracking. Records what students drag, how long they spend, what elements they interact with.

8. **Generation Limit & Paywall** — PaywallService tracks generation count server-side. 10 free visuals, then paywall.

9. **Fallback Visuals** — LocalVisualService provides recovery visuals when generation fails. Never shows a blank screen.

10. **Predictive Cache Seeding** — Pre-generates top 30 concepts for the student's grade/subject on WiFi launch.

11. **Search History** — Tracks recent searches locally.

12. **Trending Concepts** — Tracks most-searched concepts.

13. **Bookmarks** — Save concepts for later.

14. **Notes** — Per-concept note-taking within visual sessions.

### Screens Built (UI present, data partially or fully hardcoded) 🔶

- **Home Screen** — Concept of the Day card, stats grid (XP, streak, accuracy, concepts mastered), subject chips, continue learning, inline mini quiz.
- **Explore Screen** — Browse by subject, recent searches, trending this week, search + generate.
- **Profile/Settings Screen** — Level badge, XP progress bar, stats, badges carousel, activity heatmap, appearance settings.
- **Daily Challenge** — Quiz-style challenge with streak tracking and XP rewards.
- **Learning Roadmap** — Chapter progress, timeline with mastered/in-progress/locked lessons, subject tabs.
- **Subject Screen** — Hero banner with progress ring, browse topics grid, recommended next concepts.
- **Exam Packs** — Curated collections (SAT Math, AP Physics, etc.) with PRO locks.
- **Goal Setting** — Choose learning goals and target subjects.
- **Activity Screen** — Streak card, study heatmap (GitHub-style), XP bar chart, time by subject breakdown.
- **Saved Concepts / Bookmarks** — Grid and list views with subject filtering.
- **Notifications** — Notification cards with filters and settings toggles.

### Curriculum Architecture 📚

Prologue supports multiple education boards:
- **Common Core** (United States) — Grades 6–12
- **Advanced Placement (AP)** — Grades 11–13
- **CBSE** (India) — Grades 6–12
- **General / International** — Grades 6–13

Each board maps to specific subjects, and each (board, subject, grade) tuple maps to a full syllabus with units, topics, descriptions, XP values, quiz markers, and sequential unlock logic.

### Planned but Not Yet Built ❌

- StatsService (XP, streaks, accuracy, level tracking)
- Badge unlock system
- Dark mode / theme switching
- Share functionality (share visuals as links)
- Push notifications (FCM/APNs)
- In-app review prompts
- Analytics backend (Mixpanel / PostHog)
- Teacher Dashboard
- LMS integrations (Google Classroom, Canvas)
- Native Flutter visual component library (Phase 2–3)

---
 or their students' history

#

### Pricing (Placeholder — Under Review)

- **Free:** $0 — 10 total generations
- **Pro Monthly:** ~$9.99/mo
- **Pro Annual:** ~$79.99/yr

Dual payment rails: Stripe for web, RevenueCat (Apple IAP) for iOS. Both update the same `subscription_status` column in the database.

---

## 14. The First Five Minutes (Onboarding)

A new student opens the app. They go through 13 conversational screens, one question each:

1. **Brand reveal** — "This is Prologue"
2. **The problem** — "Sound familiar?" (frustration with static learning)
3. **The old way** — Comparison of traditional vs. interactive
4. **Live gravity demo** — First wow moment — interactive visual right in onboarding
5. **Confirmation** — "This is what learning should feel like"
6. **Board selection** — CBSE, AP, Common Core, or General
7. **Grade selection** — Grade-matched demo visual loads
8. **Trust screen** — Privacy promises, no-cheating assurance
9. **Name** — Personalization
10. **Subjects** — Multi-select subjects they're studying
11. **Hardest subject** — What they struggle with most
12. **Summary** — Review all selections
13. **Welcome** — "Let's begin"

After onboarding, the predictive cache re-seeds using the student's actual grade and hardest subject instead of defaults.

---

## 15. Scalability Path

### MVP (Current — up to ~10,000 users)
- Supabase free tier
- PostgreSQL cache handles the read-heavy pattern
- Hive local cache keeps per-device costs at zero
- Edge functions on Supabase's Deno runtime

### 10,000+ Users
- Read replicas on `visuals` table
- Concept clustering: semantically equivalent queries → same cached visual
- Begin building native Flutter component library for top 20 concept types

### 50,000+ Users — District Scale
- SSO / SAML integration with district identity providers
- FERPA compliance audit
- Google Classroom and Canvas LMS integration
- Dedicated Supabase instance with private networking
- CDN for cached HTML visuals (static asset delivery)
- Monitoring: Prometheus + Grafana

### 500,000+ Users — National Scale
- Multi-region deployment (US East, EU, Asia Pacific)
- Fine-tuned model evaluation — after 100K+ visuals, dataset is large enough to fine-tune a smaller model for 10x cost reduction
- Dedicated model inference via Anthropic Enterprise
- Pre-moderation layer for generated visuals (human review spot-check)

---

## 16. The North Star

> Every student, regardless of where they go to school, who their teacher is, or whether anyone at home can help them — should be able to understand anything they are curious about.

> Not read about it. Not watch someone explain it. **Understand it — by exploring it themselves.**

That is what Prologue is for.

---

## 17. Quick Reference — Key Facts

| | |
|---|---|
| **Product name** | Prologue |
| **Internal codename** | Visual Learn |
| **Tagline** | "Don't read it. Touch it." |
| **Founding team** | Solo developer (notnishant) |
| **Platform** | iOS, Android, Web |
| **Framework** | Flutter (app), Next.js (website) |
| **AI models** | Claude Sonnet (visual gen), Claude Haiku (classify + Q&A) |
| **Backend** | Supabase (Auth, PostgreSQL, Edge Functions, Mumbai region) |
| **Started** | April 2026 |
| **Current status** | Week 5+ — Core loop functional, dual-mode generation, curriculum architecture in progress |
| **GitHub** | Private (pre-launch) |
| **Design system** | "Editorial Textbook" — warm ivory, DM Serif Display + DM Sans, vermillion accent |
| **Boards supported** | Common Core (US), AP (US), CBSE (India), General/International |
| **Demo visuals** | Newtonian Gravity, Linear Regression, Supply and Demand |
