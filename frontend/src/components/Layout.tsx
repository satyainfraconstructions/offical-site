import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from '../assets/Design.jpg';

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "My Projects", href: "/projects" },
  { name: "Contact Us", href: "/contact" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role")); // get user role
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-ash">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 construction-gradient rounded-lg flex items-center justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  />
              </div>
              <span className="font-bold text-xl text-foreground">
                SatyaInfra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-smooth relative",
                    isActive(item.href)
                      ? "text-foreground font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 construction-gradient rounded-full" />
                  )}
                </Link>
              ))}

              {/* Show Login only if not admin */}
              {role !== "admin" && (
                <Link
                  to="/login"
                  className={cn(
                    "text-sm font-medium transition-smooth relative",
                    isActive("/login")
                      ? "text-foreground font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Contact Info & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Desktop Contact Info */}
              <div className="hidden lg:flex items-center space-x-4 text-sm text-muted-foreground">
                {/* <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div> */}
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>satyainfraconstructions@gmail.com</span>
                </div>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-smooth",
                      isActive(item.href)
                        ? "text-foreground font-semibold bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Show Login only if not admin */}
                {role !== "admin" && (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium rounded-md text-foreground/70 hover:text-foreground hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}

                {/* Mobile Contact Info */}
                <div className="px-3 py-2 border-t border-border mt-4 space-y-2">
                  {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div> */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>satyainfraconstructions@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 construction-gradient rounded-lg flex items-center justify-center">
                  <span className="text-construction-foreground font-bold text-xl">
                    SI
                  </span>
                </div>
                <span className="font-bold text-xl text-foreground">
                  SatyaInfra
                </span>
              </div>
              <p className="text-muted-foreground mb-4">
                Building tomorrow's infrastructure today. Professional
                construction services with over 20 years of experience.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                {/* {role !== "admin" && (
                  <li>
                    <Link
                      to="/login"
                      className="text-muted-foreground hover:text-primary transition-smooth"
                    >
                      Login
                    </Link>
                  </li>
                )} */}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
              <div className="space-y-2">
                {/* <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div> */}
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>satyainfraconstructions@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 SatyaInfra Constructions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}