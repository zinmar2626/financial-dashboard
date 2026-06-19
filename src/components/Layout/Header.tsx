import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
  onMenuToggle: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Header({ pageTitle, onMenuToggle }: HeaderProps) {
  const today = dateFormatter.format(new Date());

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-3">
        {/* Hamburger + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {pageTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">
              {today}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notification bell */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs sm:text-sm font-semibold text-white flex-shrink-0">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
