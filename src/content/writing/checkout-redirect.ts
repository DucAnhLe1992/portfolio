import type { Article } from '@/content/types';

const SRC = 'https://github.com/DucAnhLe1992/CarRental/blob/f526e0efdce465fb0286b911974af9e627124bf5/backend/src';

export const checkoutRedirect: Article = {
  slug: 'checkout-redirect-is-not-confirmation',
  title: 'Why a checkout redirect should not confirm a booking',
  summary:
    'The success page a customer lands on after paying feels like proof. It is not. Notes on trust boundaries from the Car Rental payment flow.',
  published: '2026-11-05',
  tags: ['Payments', 'Stripe', 'Trust boundaries'],
  draft: false,
  readingMinutes: 6,
  relatedProject: 'car-rental',
  sections: [
    {
      id: 'tempting',
      title: 'The tempting shortcut',
      blocks: [
        {
          type: 'p',
          text: 'With Stripe Checkout, the customer leaves your site, pays on Stripe’s page, and is sent back to a success URL you chose. The obvious implementation is to mark the booking as paid when that page loads. It works in every demo. It is also the wrong place to make the decision.',
        },
        {
          type: 'p',
          text: 'The success redirect is a message from the customer’s browser. Anything the browser sends, a person can replay, edit or skip. Three ordinary situations break the shortcut:',
        },
        {
          type: 'list',
          items: [
            'The customer pays, then closes the tab before the redirect finishes. Money moved, but the booking never confirms.',
            'Someone visits the success URL directly, with a guessed or copied booking id. Nothing moved, but the booking confirms.',
            'The customer refreshes the success page. The confirmation logic runs twice.',
          ],
        },
      ],
    },
    {
      id: 'authority',
      title: 'Give authority to the party that knows',
      sources: [{ label: 'webhookController.ts', href: `${SRC}/controllers/webhookController.ts` }],
      blocks: [
        {
          type: 'p',
          text: 'Only Stripe knows whether the payment succeeded. Stripe tells your server directly through a webhook, signed with a secret only the two of you share. In the Car Rental API, that webhook is the single way a booking moves from pending_payment to confirmed.',
        },
        {
          type: 'p',
          text: 'The success page can still exist, but it should only display state, never change it. A return page that wants to be faster than the webhook can ask Stripe for the session server-side and run the same transition; what it must not do is trust parameters in its own URL.',
        },
        {
          type: 'table',
          head: ['Signal', 'Who sends it', 'What it may do'],
          rows: [
            ['Success redirect', 'Customer’s browser', 'Show a status page; never change state'],
            ['checkout.session.completed', 'Stripe, signed', 'Move pending_payment → confirmed'],
            ['checkout.session.expired', 'Stripe, signed', 'Move pending_payment → cancelled, release dates'],
          ],
        },
      ],
    },
    {
      id: 'details',
      title: 'Details that matter',
      sources: [
        { label: 'app.ts', href: `${SRC}/app.ts` },
        { label: 'webhookController.ts', href: `${SRC}/controllers/webhookController.ts` },
      ],
      blocks: [
        {
          type: 'h3',
          text: 'Verify the raw bytes',
        },
        {
          type: 'p',
          text: 'Signature verification hashes the exact request body. If a JSON parser runs first and re-serialises the payload, the signature will not match. The webhook routes are mounted before the global JSON middleware so they receive the raw bytes.',
        },
        {
          type: 'code',
          lang: 'ts',
          caption: 'Order of middleware in app.ts',
          code: "app.use('/webhooks', webhookRoutes); // raw body for signature checks\napp.use(express.json());",
        },
        {
          type: 'h3',
          text: 'Expect duplicates',
        },
        {
          type: 'p',
          text: 'Stripe retries webhooks it does not see acknowledged, and may deliver the same event more than once. Each event id is inserted into a table with a unique constraint. A duplicate conflicts on that insert, the handler returns 200, and nothing else happens.',
        },
        {
          type: 'p',
          text: 'In the project, that insert commits before the booking is updated, in a separate step. If the process stops in between, the retry is skipped as a duplicate and the booking never confirms. Recording the event and applying the transition in one transaction removes that gap.',
        },
        {
          type: 'h3',
          text: 'Lock before you transition',
        },
        {
          type: 'p',
          text: 'The webhook can arrive while the customer is cancelling. The handler locks the booking row and only moves it if it is still pending_payment, so a cancelled booking is not revived by a late payment event.',
        },
        {
          type: 'p',
          text: 'Not reviving it is only half the answer, though. If the customer cancelled and then paid on a checkout page they still had open, the event is ignored and the money stays captured. That case needs an automatic refund, or at least an alert.',
        },
        {
          type: 'h3',
          text: 'Know which payment methods you accept',
        },
        {
          type: 'p',
          text: 'The project treats `checkout.session.completed` as paid and does not read the session’s `payment_status`. That holds for cards, which is what I tested with. But the checkout session does not restrict payment methods, so whatever is enabled in the Stripe dashboard can appear, and with delayed methods such as bank debits a completed session can still be `unpaid`. The handler should check `payment_status` and also handle `checkout.session.async_payment_succeeded`.',
        },
      ],
    },
    {
      id: 'conclusion',
      title: 'What this does not solve',
      blocks: [
        {
          type: 'p',
          text: 'If a webhook is lost entirely, after all retries, the booking stays pending. A reconciliation job that periodically asks Stripe for the status of pending sessions would close that gap, and would also catch the dedupe gap above. It is on the list for the project.',
        },
      ],
    },
  ],
};
