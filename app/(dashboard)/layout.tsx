import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen relative ">
      <aside className="absolute h-full w-[200px] border-r-2 border-black/10 top-0 left-0">
        MOOD
      </aside>
      <div className="ml-[200px]">
        <header className="h-[60px] border-b border-black/10">
          <div className="h-full w-full flex justify-end items-center px-6">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-60px)]">{children}</div>
      </div>
    </div>
  );
}
