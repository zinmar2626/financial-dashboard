import { Bell } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Header({ pageTitle }: HeaderProps) {
  const today = dateFormatter.format(new Date());

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{pageTitle}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{today}</p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Notification bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
