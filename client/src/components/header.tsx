import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, User, Heart, LogOut } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-black/40 supports-[backdrop-filter]:bg-black/30">
      <div className="container flex h-16 items-center justify-between mx-auto px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center hover-elevate active-elevate-2 px-3 py-2 -ml-3 rounded-lg cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" tabIndex={0}>
            <img
              src="/logo-full.png"
              alt="SanctifAi Logo"
              className="h-8 w-auto"
            />
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" data-testid="link-search">
            <span
              className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                location === "/" ? "text-primary" : "text-white/80"
              }`}
              tabIndex={0}
            >
              Search
            </span>
          </Link>
          {isAuthenticated && (
            <Link href="/library" data-testid="link-library">
              <span
                className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                  location === "/library" ? "text-primary" : "text-white/80"
                }`}
                tabIndex={0}
              >
                My Library
              </span>
            </Link>
          )}
          <Link href="/community" data-testid="link-community">
            <span
              className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                location === "/community" ? "text-primary" : "text-white/80"
              }`}
              tabIndex={0}
            >
              Community
            </span>
          </Link>
          <Link href="/about" data-testid="link-about">
            <span
              className={`body-small font-medium transition-all duration-200 hover:text-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded px-2 py-1 -mx-2 -my-1 ${
                location === "/about" ? "text-primary" : "text-white/80"
              }`}
              tabIndex={0}
            >
              About
            </span>
          </Link>
          <ThemeToggle />

          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl} alt={user.email} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-600 to-yellow-500 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.firstName && user.lastName && (
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/library">
                        <User className="mr-2 h-4 w-4" />
                        My Library
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/support">
                        <Heart className="mr-2 h-4 w-4" />
                        Support the Mission
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/api/auth/logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white border-0"
                >
                  <a href="/api/auth/google">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In with Google
                  </a>
                </Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
