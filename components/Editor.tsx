"use client";
import { updateEntry } from "@/utils/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";
import Spinner from "./Spinner";
import { Entry } from "@/app/(dashboard)/journal/[id]/page";

export default function Editor({ entry }: Entry) {
  const [value, setValue] = useState(entry?.content || "");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry?.analysis);

  const { mood, summary, color, negative, subject } = analysis;

  const analysisData = [
    {
      name: "Summary",
      value: summary,
    },
    {
      name: "Subject",
      value: subject,
    },
    {
      name: "Mood",
      value: mood,
    },
    {
      name: "Negative",
      value: negative ? "negative" : "positive",
    },
  ];

  useAutosave({
    data: value,
    onSave: async (_value: string) => {
      setIsLoading(true);
      const data = await updateEntry(entry.id, _value);
      setAnalysis(data?.analysis);
      setIsLoading(false);
    },
  });
  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <Spinner />}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10 col-span-1 ">
        <div
          className="px-6 py-10 bg-blue-300"
          style={{ backgroundColor: color }}
        >
          <h2 className={`text-2xl ${negative && "text-white"}`}>Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((data) => (
              <li
                className="flex px-2 py-4 border-b border-t border-black/10 items-center justify-between"
                key={data.name}
              >
                <span className="text-xl font-semibold">{data.name}</span>
                <span className="">{data.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
