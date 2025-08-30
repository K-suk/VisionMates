import AvatarPixel from "./AvatarPixel";

type Comment = {
  id: string;
  author_id?: string;
  author_name?: string | null;
  body: string;
  created_at?: string;
};

export default function CommentList({ comments = [] as Comment[] }) {
  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="flex gap-3 items-start">
          <AvatarPixel />
          <div className="flex-1">
            <div className="text-xs text-stone-600 mb-1">
              {c.author_name ?? c.author_id ?? "Adventurer"}
              {c.created_at && (
                <span className="ml-2">{new Date(c.created_at).toLocaleString()}</span>
              )}
            </div>
            <div className="text-stone-800 whitespace-pre-wrap">{c.body}</div>
          </div>
        </li>
      ))}
      {comments.length === 0 && <li className="text-stone-600">No comments.</li>}
    </ul>
  );
}

