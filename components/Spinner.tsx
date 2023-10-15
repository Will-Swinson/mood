"use client";
import { MoonLoader } from "react-spinners";
export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <MoonLoader color="#000000" loading={true} speedMultiplier={1} />
    </div>
  );
}
