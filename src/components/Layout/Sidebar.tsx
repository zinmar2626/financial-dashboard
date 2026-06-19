import {
  Briefcase,
  FileText,
  HardHat,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "projects", label: "All Projects", icon: Briefcase },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-700/50">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <HardHat className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">
            ConstructFi
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            Financial Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-active text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-300 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-white">
            CF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              ConstructFi Inc.
            </p>
            <p className="text-[11px] text-slate-400">Enterprise</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
