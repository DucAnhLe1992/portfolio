import type { Article } from '@/content/types';

const SRC = 'https://github.com/DucAnhLe1992/CarRental/blob/f526e0efdce465fb0286b911974af9e627124bf5/backend/src';

export const overlappingReservations: Article = {
  slug: 'preventing-overlapping-reservations',
  title: 'Preventing overlapping reservations: what the database must guarantee',
  summary:
    'A "check availability, then insert" sequence has a gap two requests can slip through together. How row locks close it, and what they cost.',
  published: '2026-11-05',
  tags: ['PostgreSQL', 'Concurrency', 'Transactions'],
  draft: false,
  readingMinutes: 7,
  relatedProject: 'car-rental',
  sections: [
    {
      id: 'gap',
      title: 'The gap between check and insert',
      blocks: [
        {
          type: 'p',
          text: 'Most booking code reads like this: look for bookings that overlap the requested dates; if there are none, insert the new one. Run it once and it is correct. Run it twice at the same moment and both requests can see "no overlap" before either has inserted.',
        },
        {
          type: 'table',
          head: ['Time', 'Request A', 'Request B'],
          rows: [
            ['t1', 'SELECT overlaps → none', ''],
            ['t2', '', 'SELECT overlaps → none'],
            ['t3', 'INSERT booking', ''],
            ['t4', '', 'INSERT booking'],
          ],
          caption: 'Both requests succeed; the car is double-booked.',
        },
        {
          type: 'p',
          text: 'A transaction alone does not fix this. Under PostgreSQL’s default isolation level, each transaction sees committed data, and at t2 nothing has been committed yet.',
        },
      ],
    },
    {
      id: 'anchor',
      title: 'Lock an anchor row',
      sources: [{ label: 'createBookingInTx', href: `${SRC}/services/bookingService.ts#L59-L130` }],
      blocks: [
        {
          type: 'p',
          text: 'You cannot lock rows that do not exist yet, so locking "the overlapping bookings" is not enough when there are none. The Car Rental API instead locks the car itself. Every request that might change that car’s availability must take the same lock first, so they run one after another.',
        },
        {
          type: 'code',
          lang: 'sql',
          code: "SELECT id FROM cars WHERE id = $1 FOR UPDATE;\n\nSELECT id FROM bookings\nWHERE car_id = $1\n  AND status IN ('pending_payment', 'confirmed')\n  AND start_date <= $3  -- requested end\n  AND end_date   >= $2  -- requested start\nFOR UPDATE;\n\nINSERT INTO bookings (...) VALUES (...);",
          caption: 'Simplified from the Drizzle query. Both comparisons are inclusive.',
        },
        {
          type: 'p',
          text: 'The comparisons are inclusive because rental dates are: a booking from 4 to 7 June includes 7 June and is priced as four days. A new booking that starts on 7 June therefore conflicts. With half-open ranges, where the end date is the morning the car comes back, you would use strict `<` and `>` instead. Pick one meaning and use it in the overlap check, the price and the interface.',
        },
        {
          type: 'p',
          text: 'Request B now waits at the first statement until A commits. When it continues, it sees A’s booking and is rejected with a conflict.',
        },
      ],
    },
    {
      id: 'order',
      title: 'Consistent lock order',
      blocks: [
        {
          type: 'p',
          text: 'Modifying and cancelling bookings also touch availability. If one path locks the booking and then the car, while another locks the car and then the booking, two requests can each hold the lock the other needs. Re-reading the project for this article, I found it does not yet follow one order:',
        },
        {
          type: 'list',
          items: [
            'Create: car → overlapping bookings → insert',
            'Modify: booking (joined with its car) → car → overlapping bookings',
            'Cancel: unlocked read of the booking → car → update the booking',
          ],
        },
        {
          type: 'p',
          text: 'PostgreSQL detects deadlocks and aborts one of the transactions, so the failure mode is an error response, not a hang. Cancel has a second, quieter issue: it checks the status it read before taking the lock. The fix for both is the same rule applied everywhere: lock the car first, then read the booking again under that lock.',
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Lesson',
          text: 'Writing down the lock order for every path, rather than for the path you tested, is what surfaced this. It is now the first item on the project’s list.',
        },
      ],
    },
    {
      id: 'cost',
      title: 'What it costs, and alternatives',
      sources: [{ label: 'recorded race results', href: 'https://github.com/DucAnhLe1992/CarRental/blob/f526e0efdce465fb0286b911974af9e627124bf5/requests/race-condition-results-after-anchor-lock.txt' }],
      blocks: [
        {
          type: 'p',
          text: 'Locking per car serialises requests for the same car, not for the whole fleet, so contention stays local. The real cost is keeping the lock short: Stripe calls happen after the transaction commits, never while the lock is held.',
        },
        {
          type: 'p',
          text: 'PostgreSQL also offers exclusion constraints over date ranges, which reject overlaps at the storage level. Because they can be partial (only for pending and confirmed bookings), they would add a second line of defence beneath the application logic, and are a change I would consider next.',
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'About the tests',
          text: 'The repository’s race-condition scripts fire concurrent requests at a local database. The recorded run of ten concurrent creates for the same dates shows one success and nine conflicts. That shows the create path behaves as intended in that setup; it is not a proof under every deployment, and it does not exercise modify racing cancel.',
        },
      ],
    },
  ],
};
