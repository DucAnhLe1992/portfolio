import type { Project } from '@/content/types';

const SRC = 'https://github.com/DucAnhLe1992/CarRental/blob/f526e0efdce465fb0286b911974af9e627124bf5';

export const carRental: Project = {
  slug: 'car-rental',
  title: 'Car Rental',
  label: 'Full-stack · Payments',
  summary:
    'A full-stack rental app with role-based auth, row-locked booking, Stripe Checkout, and webhook-driven confirmation.',
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
    'Customers browse a fleet, pick a date range, and pay through Stripe Checkout. Admins manage the fleet and see every booking. Behind that simple flow sits the part I cared most about: a car should not be sold twice for the same dates, and a booking should become confirmed only when the payment provider says so. This page describes what the code does today, including the places where it falls short of that goal.',
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
            'Payment runs through Stripe Checkout in test mode; no live money is involved. A pending booking holds its dates for 60 minutes, matching the checkout session’s expiry.',
            'Rental dates are inclusive: a 4–7 June booking covers four days, is priced as four days, and blocks 7 June.',
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
          text: 'A booking is created before payment happens. Between "reserve these dates" and "payment succeeded" there is a window that can last many minutes. During that window another customer may try to reserve overlapping dates, the customer may change their dates, an admin may cancel, and Stripe may retry its webhook. Each of those interleavings needs a defined outcome.',
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
            ['checkout.session.completed', 'pending_payment', 'confirmed', 'Signed webhook, event id not seen before'],
            ['checkout.session.expired', 'pending_payment', 'cancelled', 'Signed webhook, event id not seen before'],
            ['POST /bookings/:id/cancel', 'pending_payment', 'cancelled', 'Owner or admin'],
            ['POST /bookings/:id/cancel', 'confirmed', 'cancelled', 'Owner or admin; refund initiated'],
          ],
        },
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      sources: [
        { label: 'createBookingInTx', href: `${SRC}/backend/src/services/bookingService.ts#L59-L130` },
        { label: 'cancelBooking', href: `${SRC}/backend/src/services/bookingService.ts#L385-L470` },
        { label: 'modifyBooking', href: `${SRC}/backend/src/services/bookingService.ts#L496-L600` },
      ],
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
        { type: 'h3', text: 'The car row as a lock anchor' },
        {
          type: 'p',
          text: 'When creating a booking there may be no overlapping rows to lock yet, so the service locks the car row with `SELECT … FOR UPDATE` first. Concurrent create requests for the same car then queue on that lock, and the second one sees the first one’s pending booking when it runs its overlap check.',
        },
        { type: 'h3', text: 'Lock order, as implemented' },
        {
          type: 'p',
          text: 'Modify and cancel also take the car lock, but not in the same order as create. Writing this page made that visible:',
        },
        {
          type: 'table',
          head: ['Operation', 'Lock sequence in the code today'],
          rows: [
            ['Create booking', 'car row → overlapping booking rows → insert'],
            ['Modify booking', 'booking row joined to its car `FOR UPDATE` → car row → overlapping booking rows → update'],
            ['Cancel booking', 'unlocked read of booking → car row → update booking (implicit row lock)'],
          ],
          caption: 'Modify locks the booking in its first statement; cancel only reaches the booking after the car.',
        },
        {
          type: 'p',
          text: 'Because modify and cancel do not acquire the same two rows in a guaranteed order, they can in principle deadlock. PostgreSQL detects deadlocks and aborts one transaction with an error, so the result is a failed request rather than a hang, but it is not the guarantee the architecture notes imply. Cancel also checks the booking’s status from a read taken before it held the lock, so two simultaneous cancels of a confirmed booking can both pass that check. I found both by reading the code, not by reproducing them.',
        },
      ],
    },
    {
      id: 'payments',
      title: 'Payment confirmation',
      sources: [{ label: 'webhookController.ts', href: `${SRC}/backend/src/controllers/webhookController.ts` }],
      blocks: [
        {
          type: 'p',
          text: 'The webhook route reads the raw request body and verifies Stripe’s signature before anything else. It then inserts the event id into a `stripe_events` table with a unique constraint; if the insert conflicts, the event was seen before and the handler returns 200 without doing anything.',
        },
        {
          type: 'p',
          text: 'The booking transition runs afterwards, in its own transaction that locks the booking row and only acts if it is still `pending_payment`. That makes redelivered events harmless, but it leaves a gap:',
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Known gap: dedupe outside the transition',
          text: 'The event id is committed before the booking is updated. If the process stops between the two, Stripe’s retry is treated as already processed and the booking stays pending. The fix is to record the event and apply the transition in one transaction.',
        },
        {
          type: 'p',
          text: 'The handler treats `checkout.session.completed` as payment success without reading `payment_status`. That holds for cards, which is what I tested with, but the session does not restrict payment methods; delayed methods such as bank debits would need a `payment_status` check and the `checkout.session.async_payment_succeeded` event.',
        },
        {
          type: 'p',
          text: 'If a customer cancels and then completes payment on a checkout tab they still had open, the event is correctly ignored, since the booking is no longer pending, but nothing refunds the charge. That needs an automatic refund or an alert.',
        },
      ],
    },
    {
      id: 'verification',
      title: 'Verification',
      sources: [
        { label: 'race-condition results', href: `${SRC}/requests/race-condition-results-after-anchor-lock.txt` },
        { label: 'modify results', href: `${SRC}/requests/race-condition-modify-results.txt` },
        { label: 'test scripts', href: `${SRC.replace('/blob/', '/tree/')}/requests` },
      ],
      blocks: [
        {
          type: 'p',
          text: 'The repository includes scripts that fire concurrent requests at a locally running API, plus a recorded log of an idempotency run. They are reproducible checks against one local database, not proof of behaviour under production load, and they do not yet cover the modify-versus-cancel interleaving described above.',
        },
        {
          type: 'table',
          caption: 'Recorded runs committed to the repository',
          head: ['Run', 'Requests', 'Recorded outcome'],
          rows: [
            ['Concurrent create, after the car lock', '10 POSTs, same car, 1–5 Aug', '1 × 201, 9 × 409 overlap'],
            ['Concurrent modify', '5 PUTs moving different bookings onto 1–5 Nov', '1 × 200, 4 × 409'],
          ],
        },
        {
          type: 'list',
          items: [
            '`race-condition-test.mjs`: concurrent create requests for the same car and dates.',
            '`race-condition-modify-test.mjs`: competing modify operations.',
            '`idempotency-test.mjs` and `idempotency-test-results.txt`: repeated create requests with the same Idempotency-Key.',
            '`api.http`: a hand-runnable collection of every endpoint.',
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
      alternative: 'Trust the parameters on the success redirect the browser lands on after checkout.',
      why: 'Redirect parameters come from the browser: they can be replayed or edited, and never arrive if the tab closes. A signed webhook arrives even if the customer disappears. A return page could also ask Stripe for the session status server-side; that would be a valid second trigger for the same logic.',
    },
    {
      title: 'Hold inventory during payment?',
      choice: 'Pending bookings block overlapping dates until confirmed or cancelled.',
      alternative: 'Only confirmed bookings count towards availability.',
      why: 'Otherwise two customers can both pay for the same car. The cost is that an abandoned checkout holds the dates until Stripe’s expiry webhook arrives.',
    },
    {
      title: 'Where do Stripe calls happen?',
      choice: 'Outside the database transaction, with Stripe idempotency keys.',
      alternative: 'Call Stripe while holding row locks.',
      why: 'Network calls inside a transaction stretch lock windows and block other customers. Idempotency keys make the out-of-transaction call safe to retry.',
    },
  ],
  outcome: {
    works:
      'Customers can browse cars, book a date range and pay with Stripe Checkout in test mode; admins manage the fleet and see every booking. A booking becomes confirmed only from a signed Stripe webhook.',
    verified:
      'Repository scripts fire concurrent requests at a locally running API: 10 simultaneous bookings for the same car and dates produced 1 success and 9 overlap rejections. Repeated requests with one idempotency key were also checked locally.',
    limits:
      'Modify and cancel take locks in a different order, webhook dedupe and the state change are not atomic, and a payment completed after cancellation is not refunded automatically. No live deployment is linked.',
    lesson:
      'The success redirect is a hint for the interface, not proof of payment. State changes belong to the signed event, and every rule needs a test that interleaves the operations it protects against.',
  },
  limitations: [
    'Lock order differs between modify and cancel; the planned fix is car-first everywhere, re-reading booking state after the lock, with a test that interleaves the two.',
    'Webhook dedupe and the state transition are not atomic, the handler does not check `payment_status`, and a payment completed after cancellation is not refunded automatically.',
    'Pending holds are released only by the expiry webhook; there is no reconciliation job that asks Stripe for session status.',
    'Test-mode card payments only; no live deployment is currently linked.',
    'Screenshots and a short recording are still to be added to this page.',
  ],
};
