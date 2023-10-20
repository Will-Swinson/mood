export default function CustomTooltip({ payload, active, label }) {
  // Formatting the date to look nice
  const dateLabel = new Date(label).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  // If the tooltip is active, return the custom content
  if (active) {
    // Will grab the payload from the chart
    // Will only show the payload if it's active
    const analysis = payload[0].payload;
    return (
      <div className="p-8 custom-tooltip bg-white/5 shadow-md border border-black/10 rounded-lg backdrop-blur-md relative">
        <div
          className="absolute left-2 top-2 w-2 h-2 rounded-full"
          style={{ background: analysis.color }}
        ></div>
        <p className="label text-sm text-black/30">{dateLabel}</p>
        <p className="intro text-xl uppercase">{analysis.mood}</p>
      </div>
    );
  }

  // If the tooltip is not active return null so nothing appears
  return null;
}
