import HistoryChart from "@/components/HistoryChart";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

async function getData() {
  const user = await getUserByClerkID();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    // Must order by asc so the chart work from oldest to newest entry
    orderBy: {
      createdAt: "asc",
    },
  });
  const sum = analyses.reduce((acc, cur) => acc + cur.sentimentScore, 0);

  const average = Math.round(sum / analyses.length);

  return { average, sum, analyses };
}

export default async function HistoryPage() {
  const { analyses, average, sum } = await getData();
  console.log(analyses, average, sum);
  return (
    <div className="w-full h-full ">
      <div >Avg. Sentiment Score ({average})</div>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
}
