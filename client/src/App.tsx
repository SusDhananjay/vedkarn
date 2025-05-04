import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import FindMentors from "@/pages/FindMentors";
import MentorProfile from "@/pages/MentorProfile";
import BookSession from "@/pages/BookSession";
import Dashboard from "@/pages/Dashboard";
import Messages from "@/pages/Messages";
import VideoSession from "@/pages/VideoSession";
import BecomeAMentorPage from "@/pages/BecomeAMentorPage";
import { AuthProvider } from "@/contexts/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-mentors" component={FindMentors} />
      <Route path="/mentor/:id" component={MentorProfile} />
      <Route path="/book/:id" component={BookSession} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/messages" component={Messages} />
      <Route path="/video-session/:id" component={VideoSession} />
      <Route path="/become-a-mentor" component={BecomeAMentorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
