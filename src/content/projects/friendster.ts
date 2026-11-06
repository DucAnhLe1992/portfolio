import type { Project } from '@/content/types';

const SHA = 'a115adbecbb60db020eb9d4e557cc7500b015bb3';
const SRC = `https://github.com/DucAnhLe1992/friendster-social-network/blob/${SHA}`;

export const friendster: Project = {
  slug: 'friendster',
  title: 'Friendster Modern',
  label: 'Full-stack · Realtime',
  summary:
    'A social network with posts, comments, follows, image uploads, notifications and direct messages, plus refresh-token rotation with replay detection.',
  hardProblem:
    'How do you keep a login session alive across tabs and devices without letting a stolen refresh token stay useful?',
  kind: 'ai-assisted',
  role: 'Product direction, review and verification; code written with an AI coding assistant',
  stack: ['React', 'TypeScript', 'TanStack Query', 'Zustand', 'Express', 'MongoDB', 'Mongoose', 'Socket.io', 'sharp', 'Vitest', 'Docker', 'GitHub Actions'],
  featured: false,
  status: 'experimental',
  visual: 'token-rotation',
  evidence: {
    repository: 'https://github.com/DucAnhLe1992/friendster-social-network',
  },
  overview:
    'People register, follow each other, publish posts with images, comment, and get notified when someone interacts with them. Direct messages and typing indicators arrive over a WebSocket connection. The API is an Express server on MongoDB, the web app is React, and Docker Compose runs the whole stack behind nginx. This page covers the parts of the server that carry the most risk: sessions, uploads and conversations.',
  sections: [
    {
      id: 'context',
      title: 'Context and provenance',
      blocks: [
        {
          type: 'callout',
          tone: 'note',
          title: 'AI-assisted',
          text: 'The code was written with an AI coding assistant, and the commit history shows it. My part was deciding what to build, reviewing the result, and checking it against tests. I include it to show how I direct and verify that kind of work, not as hand-written code.',
        },
        {
          type: 'callout',
          tone: 'caution',
          title: 'Status',
          text: 'Experimental and recent. There is no hosted demo; the stack runs locally with Docker Compose. The repository README describes more than this page does, and this page sticks to what the code and tests show.',
        },
      ],
    },
    {
      id: 'sessions',
      title: 'Sessions that notice a stolen token',
      blocks: [
        {
          type: 'p',
          text: 'Sign-in issues a short-lived access token and a refresh token. Every refresh token has its own id and belongs to a family that starts at sign-in. Using it marks it rotated in a single conditional database update and issues a successor in the same family, so each refresh token works once.',
        },
        {
          type: 'list',
          items: [
            'If an already-rotated token comes back after a 30-second grace window, the server treats it as stolen and deletes every refresh session for that account, so no device can refresh again.',
            'Access tokens already issued are not checked against those records, so they keep working until they expire (15 minutes by default).',
            'Inside the grace window, a duplicate refresh is still refused; the window only stops it from revoking the account. It exists because several open tabs can refresh at the same moment with the same token, and the web client then picks up the winning tab’s new token from shared storage.',
            'Logout deletes only its own family, so other devices stay signed in.',
            'If a logout races a refresh, the refresh checks that its record still exists after issuing the successor, and withdraws the new session if not.',
          ],
        },
        {
          type: 'callout',
          tone: 'note',
          title: 'Trade-off',
          text: 'Revoking on replay also signs out the real owner once their access token expires. That is deliberate: once a token has been reused, the server cannot tell which caller is the legitimate one. Ending access tokens immediately would need a check on every request, which this project does not do.',
        },
      ],
      sources: [
        { label: 'sessions.ts', href: `${SRC}/apps/api/src/services/sessions.ts` },
        { label: 'auth.test.ts', href: `${SRC}/apps/api/tests/auth.test.ts` },
      ],
    },
    {
      id: 'uploads',
      title: 'Uploads are decoded, not trusted',
      blocks: [
        {
          type: 'p',
          text: 'The browser’s claimed file type is treated as a hint. Each upload must start with the matching file signature, then it is fully decoded with sharp, capped at 4096 px per side, stripped of metadata such as GPS location, and written back as a freshly encoded copy. A file that only looks like an image is rejected.',
        },
        {
          type: 'table',
          head: ['Rule', 'Where it is enforced'],
          rows: [
            ['At most 4 files of 5 MB each', 'Upload middleware limits'],
            ['Bytes must match the claimed type and decode', 'Signature check, then a full decode'],
            ['An uploaded image belongs to one post only', 'Server ownership check; covered by a test'],
            ['Image ids from a rejected post are released; abandoned uploads are swept', 'Media service; covered by a test'],
          ],
        },
      ],
      sources: [
        { label: 'upload.ts', href: `${SRC}/apps/api/src/middleware/upload.ts` },
        { label: 'posts.test.ts', href: `${SRC}/apps/api/tests/posts.test.ts` },
      ],
    },
    {
      id: 'messages',
      title: 'Conversations and realtime',
      blocks: [
        {
          type: 'p',
          text: 'Two people messaging each other for the first time at the same moment must end up in one conversation, not two. Each direct conversation stores a key built from the two sorted user ids, and the database enforces that key as unique. Creation is an upsert on that key, so the slower request gets the existing conversation.',
        },
        {
          type: 'list',
          items: [
            'Message history pages by time and id together, so messages with the same timestamp are never skipped.',
            'The WebSocket connection checks the access token once, then disconnects when that token expires; the client reconnects with a fresh one.',
            'Typing events are relayed only to the other people in that conversation, and limited to 10 per 5 seconds per connection.',
          ],
        },
      ],
      sources: [
        { label: 'messageController.ts', href: `${SRC}/apps/api/src/controllers/messageController.ts` },
        { label: 'realtime.ts', href: `${SRC}/apps/api/src/realtime.ts` },
        { label: 'conversations.test.ts', href: `${SRC}/apps/api/tests/conversations.test.ts` },
      ],
    },
    {
      id: 'checks',
      title: 'How it is checked',
      blocks: [
        {
          type: 'p',
          text: 'The API has 17 integration tests that run against an in-memory MongoDB. GitHub Actions runs type checks, lint, those tests and both builds on every push, then starts the full Docker stack as a smoke test. Image publishing is opt-in and has not run.',
        },
        {
          type: 'code',
          lang: 'bash',
          caption: 'The same checks CI runs',
          code: 'npm run typecheck\nnpm run lint\nnpm test\nnpm run build',
        },
      ],
      sources: [{ label: 'ci.yml', href: `${SRC}/.github/workflows/ci.yml` }],
    },
  ],
  decisions: [
    {
      title: 'How are refresh tokens stored?',
      choice: 'One database record per token, grouped into families, rotated on every use.',
      alternative: 'Long-lived stateless refresh tokens checked only by signature.',
      why: 'Stateless tokens cannot be revoked or checked for reuse. Records make logout per device and replay detection possible, at the cost of a database write on every refresh.',
    },
    {
      title: 'How are duplicate conversations prevented?',
      choice: 'A unique key per pair of users, enforced by the database.',
      alternative: 'Look for an existing conversation in application code, then create one.',
      why: 'A check-then-create in application code has a gap between the two steps. A unique index closes it regardless of timing.',
    },
  ],
  outcome: {
    works:
      'Registration, posts with images, comments, likes, follows, notifications, direct messages and typing indicators work locally, and Docker Compose runs the full stack behind nginx.',
    verified:
      '17 API integration tests cover token rotation and replay, logout across devices, upload validation, image ownership and simultaneous conversation starts. The latest CI run passed, including a Docker smoke test.',
    limits:
      'The code was written with an AI coding assistant. There is no hosted demo, no frontend test suite, and no load testing, and the project is only days old.',
    lesson:
      'Generated code still has to earn trust: the parts that matter most are the ones with tests that reproduce the race or the attack they guard against.',
  },
  limitations: [
    'Code written with an AI coding assistant; the commit history reflects that.',
    'No hosted demo; it runs locally with Docker Compose.',
    'The web app has no automated tests, and nothing has been load-tested. Refreshing from several tabs at once has not been tested in a browser.',
    'Revocation stops refreshes only; access tokens already issued stay valid for up to 15 minutes.',
    'The README lists more than this page covers; treat this page as the verified subset.',
  ],
};
