export type BookingState = 'none' | 'pending_payment' | 'confirmed' | 'cancelled' | 'rejected';
export type Actor = 'Client' | 'API' | 'Database' | 'Stripe' | 'Browser';
export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info';

export type Step = {
  actor: Actor;
  message: string;
  detail: string;
  tone: Tone;
  bookings: Record<string, BookingState>;
};

export type Scenario = { id: string; title: string; question: string; steps: Step[] };

export const scenarios: Scenario[] = [
  {
    id: 'success',
    title: 'Successful payment',
    question: 'Who decides that a booking is paid?',
    steps: [
      { actor: 'Client', message: 'POST /bookings', detail: 'Customer requests car #12 for 4–7 June.', tone: 'neutral', bookings: { A: 'none' } },
      { actor: 'Database', message: 'Lock car row, check overlaps', detail: 'No pending or confirmed booking overlaps. Insert booking A.', tone: 'info', bookings: { A: 'pending_payment' } },
      { actor: 'API', message: 'Create Checkout Session', detail: 'Called after the transaction commits, with a Stripe idempotency key. Returns checkoutUrl.', tone: 'neutral', bookings: { A: 'pending_payment' } },
      { actor: 'Browser', message: 'Redirect to /success', detail: 'A user-experience signal only. Booking state does not change.', tone: 'warn', bookings: { A: 'pending_payment' } },
      { actor: 'Stripe', message: 'checkout.session.completed', detail: 'Signature verified against raw bytes. Event id stored, booking locked, then confirmed.', tone: 'ok', bookings: { A: 'confirmed' } },
    ],
  },
  {
    id: 'expired',
    title: 'Expired checkout',
    question: 'What releases dates nobody paid for?',
    steps: [
      { actor: 'Client', message: 'POST /bookings', detail: 'Customer requests car #12 for 4–7 June.', tone: 'neutral', bookings: { A: 'none' } },
      { actor: 'Database', message: 'Insert pending booking', detail: 'Dates are now held against other customers.', tone: 'info', bookings: { A: 'pending_payment' } },
      { actor: 'Browser', message: 'Tab closed on checkout', detail: 'The customer leaves without paying. Nothing is sent to the API.', tone: 'warn', bookings: { A: 'pending_payment' } },
      { actor: 'Stripe', message: 'checkout.session.expired', detail: 'Signed webhook arrives when the session times out. Booking cancelled, dates released.', tone: 'danger', bookings: { A: 'cancelled' } },
    ],
  },
  {
    id: 'duplicate',
    title: 'Repeated callback',
    question: 'What if Stripe sends the same event twice?',
    steps: [
      { actor: 'Database', message: 'Booking A pending', detail: 'Created and waiting for payment.', tone: 'info', bookings: { A: 'pending_payment' } },
      { actor: 'Stripe', message: 'checkout.session.completed · evt_1Q9', detail: 'Insert evt_1Q9 into stripe_events. Booking confirmed.', tone: 'ok', bookings: { A: 'confirmed' } },
      { actor: 'Stripe', message: 'checkout.session.completed · evt_1Q9', detail: 'Retry delivery. Insert hits the unique constraint on stripe_event_id.', tone: 'warn', bookings: { A: 'confirmed' } },
      { actor: 'API', message: '200 OK, no-op', detail: 'Acknowledged so Stripe stops retrying. No second transition, no duplicate side effects.', tone: 'ok', bookings: { A: 'confirmed' } },
    ],
  },
  {
    id: 'race',
    title: 'Competing reservations',
    question: 'Two customers, one car, the same dates.',
    steps: [
      { actor: 'Client', message: 'A and B: POST /bookings', detail: 'Both request car #12 for 4–7 June at the same moment.', tone: 'neutral', bookings: { A: 'none', B: 'none' } },
      { actor: 'Database', message: 'A locks car row', detail: 'SELECT … FOR UPDATE succeeds for A. B’s identical lock waits.', tone: 'info', bookings: { A: 'none', B: 'none' } },
      { actor: 'Database', message: 'A inserts, commits', detail: 'No overlap found. Booking A is pending; the lock is released.', tone: 'info', bookings: { A: 'pending_payment', B: 'none' } },
      { actor: 'Database', message: 'B acquires lock, sees A', detail: 'The overlap check now finds A’s pending booking.', tone: 'warn', bookings: { A: 'pending_payment', B: 'none' } },
      { actor: 'API', message: '409 Conflict for B', detail: 'B is told the dates are unavailable. No booking row is created.', tone: 'danger', bookings: { A: 'pending_payment', B: 'rejected' } },
      { actor: 'Stripe', message: 'A: checkout.session.completed', detail: 'A pays and is confirmed. The car was never sold twice.', tone: 'ok', bookings: { A: 'confirmed', B: 'rejected' } },
    ],
  },
];
