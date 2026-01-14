import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TryOnTool from "@/components/TryOnTool";
import HowItWorks from "@/components/HowItWorks";
import HistorySidebar from "@/components/HistorySidebar";
import Footer from "@/components/Footer";

interface TryOnResult {
  id: string;
  personImage: string;
  clothingImage: string;
  resultImage: string;
  timestamp: Date;
}

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<TryOnResult[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleNewResult = (result: TryOnResult) => {
    setHistory((prev) => [result, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleHistory={() => setIsHistoryOpen(true)}
      />

      <main>
        <HeroSection />
        <TryOnTool onNewResult={handleNewResult} />
        <HowItWorks />
      </main>

      <Footer />

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default Index;
