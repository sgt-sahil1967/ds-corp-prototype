import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Package } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1 -ml-2 cursor-pointer">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">DS Corporation</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.path
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/rfq">
            <Button data-testid="button-start-rfq">Start an RFQ</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
