type HealthStatus = {
  id: number;
  title: string;
};

async function getHealthData(): Promise<HealthStatus | null> {
  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1",
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HealthPage() {
  const data = await getHealthData();
  const checkedAt = new Date().toISOString();

  return (
    <section className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
        Health check
      </p>
      <h1 className="text-3xl font-bold text-white">System Health</h1>
      <p className="max-w-xl text-slate-400">
        Confirms the deploy pipeline works end-to-end: this page fetches live
        data server-side on every request.
      </p>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              data ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <span className="font-medium text-white">
            {data ? "API reachable" : "API unreachable"}
          </span>
        </div>
        <dl className="mt-4 space-y-1 text-sm text-slate-400">
          <div>
            <dt className="inline text-slate-500">Checked at: </dt>
            <dd className="inline">{checkedAt}</dd>
          </div>
          {data && (
            <>
              <div>
                <dt className="inline text-slate-500">Sample record id: </dt>
                <dd className="inline">{data.id}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">Sample title: </dt>
                <dd className="inline">{data.title}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </section>
  );
}
