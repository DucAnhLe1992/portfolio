import type { Project } from '@/content/types';

export const carRental: Project = {
  slug: 'car-rental',
  title: 'Car Rental',
  label: 'Full-stack · Payments',
  summary:
    'A full-stack rental app with role-based auth, inventory-safe booking, Stripe Checkout, and webhook-driven confirmation.',
  hardProblem:
    'What happens when two customers want the same car for the same dates, or when Stripe delivers the same payment event twice?',
  kind: 'personal',
  role: 'Sole developer: product design, API, data model, frontend',
  stack: ['React', 'Vite', 'MUI', 'TypeScript', 'Express', 'PostgreSQL', 'Drizzle ORM', 'Stripe'],
  featured: true,
  status: 'maintained',
  visual: 'state-machine',
  evidence: {
    repository: 'https://github.com/DucAnhLe1992/CarRental',
  },
  relatedWriting: ['checkout-redirect-is-not-confirmation', 'preventing-overlapping-reservations'],
  hasExplainer: true,
  overview:
    'Customers browse a fleet, pick a date range, and pay through Stripe Checkout. Admins manage the fleet and see every booking. Behind that simple flow sits the part I cared most about: making sure a car is never sold twice for the same dates, and that a booking becomes confirmed only when the payment provider says so.',
  sections: [
    {
      id: 'context',
      title: 'Context and constraints',
      blocks: [
        {
          type: 'p',
          text: 'This is a personal project, built end to end by me. The aim was not feature breadth but correctness in the two places rental systems usually get wrong: shared inventory and asynchronous payment.',
        },
        {
          type: 'list',
          items: [
            'Customers and admins share one API, separated by role checks and booking ownership rules.',
            'Authentication uses a JWT, accepted from an Authorization header or an httpOnly cookie.',
            'Payment runs through Stripe Checkout in test mode; there is no live money involved.',
          ],
        },
      ],
    },
    {
      id: 'problem',
      title: 'The hard problem',
      blocks: [
        {
          type: 'p',
          text: 'A booking is created before payment happens. Between "reserve these dates" and "payment succeeded" there is a window that can last minutes. During that window another customer may try to reserve overlapping dates, the customer may change their dates, an admin may cancel, and Stripe may retry its webhook. Each of those interleavings needs a defined outcome.',
        },
        {
          type: 'p',
          text: 'I modelled the booking as a small state machine with three states and made the backend the only place that can move between them.',
        },
        {
          type: 'table',
          caption: 'Booking state transitions, from the repository architecture notes',
          head: ['Trigger', 'From', 'To', 'Guard'],
          rows: [
            ['POST /bookings', '—', 'pending_payment', 'No overlap with confirmed or pending bookings'],
            ['checkout.session.completed', 'pending_payment', 'confirmed', 'Signed webhook, event not seen before'],
            ['checkout.session.expired', 'pending_payment', 'cancelled', 'Signed webhook, event not seen before'],
            ['POST /bookings/:id/cancel', 'pending_payment', 'cancelled', 'Owner or admin'],
            ['POST /bookings/:id/cancel', 'confirmed', 'cancelled', 'Owner or admin; refund initiated'],
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      blocks: [
        {
          type: 'p',
          text: 'The browser never decides payment truth. It submits forms, redirects to the checkout URL and displays status. Controllers validate input and authorise; services own locking, overlap rules and idempotency; PostgreSQL is the durable source of booking state.',
        },
        {
          type: 'table',
          head: ['Component', 'Owns', 'Does not own'],
          rows: [
            ['Frontend', 'UI, form submission, redirect to checkout, feedback', 'Payment truth, confirmation authority'],
            ['Controllers', 'Input validation, auth checks, response shaping', 'Business invariants'],
            ['Services', 'Locking, overlap rules, idempotency, Stripe orchestration', 'UI behaviour'],
            ['Stripe webhooks', 'Payment completion and expiry signals', 'User session state'],
            ['Database', 'Booking and inventory state, dedupe records', 'Payment execution'],
          ],
        },
        {
          type: 'h3',
          text: 'Locking order',
        },
        {
          type: 'p',
          text: 'Every operation that can change a car’s availability locks the car row first, as an anchor, before touching overlapping bookings. A consistent order means concurrent requests for the same car queue up instead of deadlocking or reading stale state.',
        },
        {
          type: 'table',
          head: ['Operation', 'Lock sequence'],
          rows: [
            ['Create booking', 'car row → overlapping booking rows'],
            ['Modify booking', 'target booking → car row → overlapping booking rows'],
            ['Cancel booking', 'target booking read → car row → update booking'],
          ],
        },
      ],
    },
    {
      id: 'verification',
      title: 'Verification',
      blocks: [
        {
          type: 'p',
          text: 'The repository includes scripts that fire concurrent requests at a locally running API, plus a recorded log of an idempotency run. They are reproducible checks against a local database, not proof of behaviour under production load.',
        },
        {
          type: 'list',
          items: [
            'race-condition-test.mjs — concurrent create requests for the same car and dates.',
            'race-condition-modify-test.mjs — competing modify and cancel operations.',
            'idempotency-test.mjs and idempotency-test-results.txt — repeated requests with the same Idempotency-Key.',
            'api.http — a hand-runnable collection of every endpoint.',
          ],
        },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Local webhook forwarding during testing',
          code: 'stripe listen --forward-to localhost:3000/webhooks/stripe\nnode requests/race-condition-test.mjs',
        },
      ],
    },
  ],
  decisions: [
    {
      title: 'Who confirms a booking?',
      choice: 'Only the signed Stripe webhook moves a booking to confirmed.',
      alternative: 'Trust the success redirect the browser lands on after checkout.',
      why: 'A redirect URL can be revisited, forged or never reached if the tab closes. A signed webhook is verified against the raw request bytes and arrives even if the customer disappears.',
    },
    {
      title: 'Hold inventory during payment?',
      choice: 'Pending bookings block overlapping dates until confirmed or expired.',
      alternative: 'Only confirmed bookings count towards availability.',
      why: 'Otherwise two customers can both pay for the same car. Checkout expiry releases the hold automatically, so abandoned sessions do not lock cars forever.',
    },
    {
      title: 'Where do Stripe calls happen?',
      choice: 'Outside the database transaction, with Stripe idempotency keys.',
      alternative: 'Call Stripe while holding row locks.',
      why: 'Network calls inside a transaction stretch lock windows and block other customers. Idempotency keys make the out-of-transaction call safe to retry.',
    },
  ],
  limitations: [
    'Test-mode payments only; no live deployment is currently linked.',
    'Concurrency tests run against a single local PostgreSQL instance, not a replicated setup.',
    'There is no background job yet for reconciling bookings if a webhook is permanently lost.',
    'Screenshots and a short recording are still to be added to this page.',
  ],
};
