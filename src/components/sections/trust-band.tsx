import { siteConfig } from '@/config/site';

export function TrustBand() {
  return (
    <section className="rounded-2xl border border-fawaid-border bg-fawaid-surface/70 p-4 md:p-6">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {siteConfig.trustItems.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-fawaid-border/80 bg-white px-4 py-3 text-sm font-medium text-fawaid-text"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
