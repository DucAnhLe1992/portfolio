import type { Article } from '@/content/types';

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
      blocks: [
        {
          type: 'p',
          text: 'Only Stripe knows whether the payment succeeded. Stripe tells your server directly through a webhook, signed with a secret only the two of you share. In the Car Rental API, that webhook is the single way a booking moves from pending_payment to confirmed.',
        },
        {
          type: 'p',
          text: 'The success page still exists, but it only reads state. It displays whatever the server currently says the booking is (pending payment, confirmed or cancelled) and treats the redirect parameters as a hint for the interface, nothing more.',
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
      blocks: [
        {
          type: 'h3',
          text: 'Verify the raw bytes',
        },
        {
          type: 'p',
          text: 'Signature verification hashes the exact request body. If a JSON parser runs first and re-serialises the payload, the signature will not match. The webhook route is mounted before the global JSON middleware and reads the raw body.',
        },
        {
          type: 'code',
          lang: 'ts',
          code: "app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);\napp.use(express.json());",
        },
        {
          type: 'h3',
          text: 'Expect duplicates',
        },
        {
          type: 'p',
          text: 'Stripe retries webhooks it does not see acknowledged, and may deliver the same event more than once. Each processed event id is inserted into a table with a unique constraint. A duplicate fails that insert, the handler returns 200, and nothing else happens.',
        },
        {
          type: 'h3',
          text: 'Lock before you transition',
        },
        {
          type: 'p',
          text: 'The webhook can arrive while the customer is cancelling. The handler locks the booking row and checks the current state before changing it, so a cancelled booking is not silently revived by a late payment event.',
        },
      ],
    },
    {
      id: 'conclusion',
      title: 'What this does not solve',
      blocks: [
        {
          type: 'p',
          text: 'If a webhook is lost entirely, after all retries, the booking stays pending until the checkout session expires. A reconciliation job that asks Stripe for the session status would close that gap; it is on the list for the project.',
        },
      ],
    },
  ],
};
