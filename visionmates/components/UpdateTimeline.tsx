type Update = {
  id: string;
  body: string;
  created_at?: string;
};

export default function UpdateTimeline({ updates = [] as Update[] }) {
  const list = [...updates].sort((a, b) =>
    (b.created_at ?? "").localeCompare(a.created_at ?? "")
  );
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-1 bg-stone-300" />
      <ul className="space-y-4">
        {list.map((u) => (
          <li key={u.id} className="relative">
            <span
              className="absolute -left-[11px] top-1 w-4 h-4 bg-gold pixel-border"
              aria-hidden
            />
            <div className="paper pixel-border rounded p-3">
              <div className="text-xs text-stone-600 mb-1">
                {u.created_at ? new Date(u.created_at).toLocaleString() : ""}
              </div>
              <div className="text-stone-800 whitespace-pre-wrap">{u.body}</div>
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="text-stone-600">No updates yet.</li>}
      </ul>
    </div>
  );
}

