export function RoomTypeCard({ name, image, description, eligibility }: { name: string; image?: string; description: string; eligibility: string }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {image && <div className="aspect-[16/9] bg-muted overflow-hidden"><img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" /></div>}
      <div className="p-4 space-y-2">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-foreground/80">{description}</p>
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{eligibility}</span>
      </div>
    </div>
  );
}
