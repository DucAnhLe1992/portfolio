import type { Project } from '@/content/types';

export const ticketBooking: Project = {
  slug: 'ticket-booking',
  title: 'Ticket Booking',
  label: 'Distributed systems · Learning',
  summary:
    'A microservices ticketing platform: auth, tickets, orders, payments and expiration services coordinating through events on NATS Streaming.',
  hardProblem:
    'How do independent services, each with its own database, agree that a ticket is reserved, paid for, or released?',
  kind: 'course-derived',
  role: 'Developer: services, shared package, infrastructure manifests',
  stack: ['Node.js', 'Express', 'TypeScript', 'Next.js', 'MongoDB', 'Redis', 'NATS Streaming', 'Docker', 'Kubernetes', 'Skaffold'],
  featured: false,
  status: 'archived',
  visual: 'services',
  evidence: {
    repository: 'https://github.com/DucAnhLe1992/ticket-booking-app',
    package: 'https://www.npmjs.com/package/@ticket-system/common',
  },
  overview:
    'Users sign up, list tickets for events, place orders, and pay through Stripe. Orders that are not paid in time are released automatically. Each capability lives in its own service with its own database, and services learn about each other only through published events.',
  sections: [
    {
      id: 'context',
      title: 'Context and provenance',
      blocks: [
        {
          type: 'callout',
          tone: 'note',
          title: 'Course-derived',
          text: 'The overall design comes from a microservices course. I built the services, published the shared code as the @ticket-system/common npm package, and wrote the Kubernetes and Skaffold setup for local development.',
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Deployment status',
          text: 'The public demo is currently offline. The repository contains local setup instructions using Docker, Kubernetes and Skaffold.',
        },
      ],
    },
    {
      id: 'trace',
      title: 'One event trace',
      blocks: [
        {
          type: 'p',
          text: 'Following a single order shows how the services coordinate without calling each other directly.',
        },
        {
          type: 'table',
          head: ['Step', 'Publisher', 'Event', 'Effect'],
          rows: [
            ['1', 'Orders', 'order:created', 'Tickets marks the ticket reserved; Expiration schedules a timeout in Redis; Payments records the order.'],
            ['2a', 'Payments', 'payment:created', 'Orders marks the order complete.'],
            ['2b', 'Expiration', 'expiration:complete', 'If unpaid, Orders cancels and publishes order:cancelled.'],
            ['3', 'Orders', 'order:cancelled', 'Tickets releases the reservation so others can buy it.'],
          ],
        },
        {
          type: 'p',
          text: 'Each record carries a version number. A service only applies an update if it is the next version it expects, which is how out-of-order events are handled. This is optimistic concurrency control.',
        },
      ],
    },
  ],
  decisions: [
    {
      title: 'How do services communicate?',
      choice: 'Asynchronous events over NATS Streaming.',
      alternative: 'Direct HTTP calls between services.',
      why: 'A service can keep working when another is down, and replays events once it returns. The trade-off is eventual consistency and harder debugging.',
    },
    {
      title: 'How is shared code distributed?',
      choice: 'A versioned npm package for middleware, errors and event types.',
      alternative: 'Copying shared files into each service.',
      why: 'Event definitions stay identical across services, and changes are explicit version bumps.',
    },
  ],
  limitations: [
    'Course-derived foundation; scalability has not been load-tested.',
    'NATS Streaming has since been deprecated in favour of NATS JetStream.',
    'The hosted demo is offline.',
  ],
};
