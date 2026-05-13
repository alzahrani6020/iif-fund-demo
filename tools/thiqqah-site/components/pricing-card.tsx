export function PricingCard({ title, price, description, features, featured }: { title: string; price: string; description: string; features: string[]; featured?: boolean }) {
  return (
    <div className={`glass-card flex flex-col rounded-[2.5rem] border-brand-glass p-8 ${featured ? 'border-2 bg-brand-emerald/10' : ''}`}>
      <span className="text-xs uppercase tracking-[0.32em] text-brand-gold/80">{title}</span>
      <h3 className="mt-4 text-4xl font-semibold text-white">{price}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
      <ul className="mt-8 space-y-3 text-sm text-slate-300">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-gold" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110">
        اختر الباقة
      </button>
    </div>
  );
}
