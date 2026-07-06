import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Acompanhamentos", path: "/acompanhamentos" },
  { label: "Cadastros", path: "/cadastros" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1">
            <span className="font-logo text-2xl font-black tracking-tight text-primary">AZIZ</span>
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">defensoria</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-primary bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 mt-auto">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-logo text-xl font-black">AZIZ</span>
            <span className="text-xs opacity-70">defensoria</span>
          </div>
          <nav className="flex items-center gap-6 text-sm opacity-80">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="hover:opacity-100 transition-opacity">
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
