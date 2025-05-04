import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { Menu, X, BookOpen } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <BookOpen className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold text-primary">MentorConnect</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8" aria-label="Main Navigation">
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
                href="/#how-it-works"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                How It Works
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
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/become-a-mentor" className="text-primary hover:text-primary-700 mr-4">
              Become a Mentor
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="outline">{user?.username || "Dashboard"}</Button>
              </Link>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>Log In / Sign Up</Button>
            )}
          </div>
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
                  <Link href="/" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                    Home
                  </Link>
                  <Link href="/find-mentors" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                    Find Mentors
                  </Link>
                  <Link href="/#how-it-works" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                    How It Works
                  </Link>
                  <Link href="/become-a-mentor" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                    Become a Mentor
                  </Link>
                  {isAuthenticated ? (
                    <Link href="/dashboard" className="text-gray-700 hover:text-primary px-2 py-1 rounded-md">
                      Dashboard
                    </Link>
                  ) : (
                    <Button onClick={() => setShowAuthModal(true)} className="w-full">
                      Log In / Sign Up
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}
