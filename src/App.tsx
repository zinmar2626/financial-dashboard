import { useState } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Projects from "./pages/Projects";

function getPageTitle(page: string): string {
  if (page === "projects") return "All Projects";
  return page.charAt(0).toUpperCase() + page.slice(1);
}

export default function App() {
  const [activePage, setActivePage] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Offset for fixed sidebar — only on desktop (lg+) */}
      <div className="lg:ml-60">
        <Header
          pageTitle={getPageTitle(activePage)}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="p-4 sm:p-6 max-w-[1400px]">
          {activePage === "projects" && <Projects />}
          {activePage !== "projects" && (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-slate-200">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700 capitalize">
                  {activePage}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  This section is coming soon.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
