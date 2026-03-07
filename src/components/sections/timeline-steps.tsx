type Step = {
  title: string;
  text: string;
};

export function TimelineSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="rounded-2xl border border-fawaid-border bg-white p-5 shadow-card">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fawaid-surface font-semibold text-fawaid-accent">
            {index + 1}
          </span>
          <h3 className="mt-3 font-heading text-lg font-semibold text-fawaid-text">{step.title}</h3>
          <p className="mt-2 text-sm text-fawaid-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
