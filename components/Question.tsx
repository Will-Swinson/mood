"use client";

import { useState } from "react";

import Spinner from "./Spinner";

import { askQuestion } from "@/utils/api";

export default function Question() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    console.log(value);
    const answer = await askQuestion(value);
    setAnswer(answer);
    setValue("");
    setIsLoading(false);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={isLoading}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        type="text"
        placeholder="Ask a question"
        className="border border-black/20 px-4 py-2 mr-2 text-lg rounded"
      ></input>
      <button
        disabled={isLoading}
        type="submit"
        className="bg-blue-400 rounded-lg px-4 py-2"
      >
        Ask
      </button>
      {isLoading && <Spinner />}
      {answer && <div>{answer}</div>}
    </form>
  );
}
