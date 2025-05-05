import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { Menu, BookOpen, LogOut, Users } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.userType === "admin";

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={isAdmin ? "/admin" : "/"} className="flex items-center">
                <BookOpen className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">MentorConnect</span>
              </Link>
            </div>
            
            {/* Main navigation - show different items for admin vs regular users */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main Navigation">
              {isAdmin ? (
                /* Admin navigation */
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === "/admin"
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Admin Dashboard
                </Link>
              ) : (
                /* Regular user navigation */
                <>
                  <Link
                    href="/"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === "/"
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/find-mentors"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === "/find-mentors"
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    Find Mentors
                  </Link>
                  <Link
                    href="/how-it-works"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === "/how-it-works"
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/group-sessions"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === "/group-sessions"
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Group Sessions
                  </Link>
                  {isAuthenticated && (
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location === "/dashboard"
                          ? "border-primary text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Link href="/become-a-mentor" className="text-primary hover:text-primary-700 mr-4">
                    Become a Mentor
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  {/* Show user info */}
                  <span className="text-gray-700 mr-2">
                    {isAdmin ? 'Admin' : user?.username}
                  </span>
                  {/* Logout button */}
                  <Button variant="outline" onClick={handleLogout} size="sm">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/become-a-mentor" className="text-primary hover:text-primary-700 mr-4">
                  Become a Mentor
                </Link>
                <Button onClick={() => setShowAuthModal(true)}>Log In / Sign Up</Button>
              </>
            )}
          </div>
          
          {/* Mobile menu */}
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-4">
                  {isAdmin ? (
                    /* Admin mobile navigation */
                    <>
                      <Link href="/admin" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                        Admin Dashboard
                      </Link>
                      <Button onClick={handleLogout} className="w-full">
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    /* Regular user mobile navigation */
                    <>
                      <Link href="/" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                        Home
                      </Link>
                      <Link href="/find-mentors" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                        Find Mentors
                      </Link>
                      <Link href="/how-it-works" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                        How It Works
                      </Link>
                      <Link href="/group-sessions" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                        <Users className="h-4 w-4 inline mr-1" />
                        Group Sessions
                      </Link>
                      <Link href="/become-a-mentor" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                        Become a Mentor
                      </Link>
                      {isAuthenticated ? (
                        <>
                          <Link href="/dashboard" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                            Dashboard
                          </Link>
                          <Button onClick={handleLogout} variant="outline" className="w-full">
                            <LogOut className="h-4 w-4 mr-1" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setShowAuthModal(true)} className="w-full">
                          Log In / Sign Up
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Only show auth modal if not admin */}
      {!isAdmin && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </header>
  );
}
