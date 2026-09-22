type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export default function PlaceholderScreen({
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <section className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
        Placeholder screen
      </p>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="max-w-xl text-slate-400">{description}</p>
    </section>
  );
}
