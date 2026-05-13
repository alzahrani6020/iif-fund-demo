export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="glass-card rounded-3xl border-brand-glass p-6">
      <h3 className="text-lg font-semibold text-white">{question}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{answer}</p>
    </div>
  );
}
