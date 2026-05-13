import { LucideIcon } from 'lucide-react';

export function ServiceCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <article className="glass-card rounded-3xl border-brand-glass p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-emerald/10 text-brand-emerald shadow-glow">
        <Icon size={24} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </article>
  );
}
