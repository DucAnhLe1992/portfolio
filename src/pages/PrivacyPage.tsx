import { PageIntro } from '@/components/ui/Headings';

const items = [
  { title: 'No analytics or tracking', text: 'This site does not use analytics, advertising trackers or cookies.' },
  { title: 'Theme preference', text: 'If you switch between light and dark theme, that choice is stored in your browser’s local storage so it is remembered next time. It never leaves your device.' },
  { title: 'Fonts', text: 'Typefaces are loaded from Google Fonts, which means your browser requests them from Google’s servers.' },
  { title: 'Images', text: 'The profile photo is loaded from GitHub’s image servers.' },
  { title: 'External links', text: 'Links to GitHub, LinkedIn and npm take you to those services, which have their own privacy policies.' },
];

export function PrivacyPage() {
  return (
    <div className="max-w-reading">
      <PageIntro eyebrow="Privacy" title="What this site does with your data.">
        <p>Very little, on purpose.</p>
      </PageIntro>
      <dl className="space-y-8">
        {items.map((i) => (
          <div key={i.title} className="border-t border-line pt-6">
            <dt className="mb-2 font-semibold">{i.title}</dt>
            <dd className="leading-[1.7] text-muted">{i.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
