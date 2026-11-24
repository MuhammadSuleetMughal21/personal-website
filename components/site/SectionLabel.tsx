export default function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
      <span className="text-accent">{index}</span>
      <span className="h-px w-10 bg-white/20" />
      {children}
    </div>
  );
}
