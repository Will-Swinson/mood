export default function EntryCard({ entry }) {
  const date = new Date(entry.createdAt).toDateString();
  console.log(entry);
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5">{date}</div>
      <div className="px-4 py-5">{entry.analysis.summary}</div>
      <div className="px-4 py-5">{entry.analysis.mood}</div>
    </div>
  );
}
