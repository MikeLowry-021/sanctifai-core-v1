import { Switch, Route, useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OnboardingModal } from "@/components/onboarding-modal";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Results from "@/pages/results";
import Library from "@/pages/library";
import Community from "@/pages/community";
import SubmitReview from "@/pages/submit-review";
import About from "@/pages/about";
import Support from "@/pages/support";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/results" component={Results} />
          <Route path="/library" component={Library} />
          <Route path="/community" component={Community} />
          <Route path="/submit-review" component={SubmitReview} />
          <Route path="/about" component={About} />
          <Route path="/support" component={Support} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const { user, isAuthenticated, isLoading, refetch } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.hasCompletedOnboarding === "false") {
        setShowOnboarding(true);
      }
    }
  }, [isLoading, isAuthenticated, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
      {showOnboarding && (
        <OnboardingModal
          open={showOnboarding}
          onComplete={handleOnboardingComplete}
          userName={user?.firstName}
        />
      )}
    </div>
  );
}

export default App;
