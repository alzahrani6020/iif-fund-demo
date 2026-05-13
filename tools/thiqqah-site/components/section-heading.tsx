export function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm uppercase tracking-[0.32em] text-brand-gold/80">ثقة ذهبية</p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>
    </div>
  );
}
