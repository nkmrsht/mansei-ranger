import { Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const handleEstimateClick = () => {
    const estimateSection = document.getElementById('estimate-wizard');
    if (estimateSection) {
      estimateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-apple-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-apple-text">電化のマンセイ</h1>
            <p className="text-sm text-gray-600">エアコン取付だけも大歓迎！ネット購入・持込OK、明朗会計で安心</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a href="tel:047-364-8112" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium">047-364-8112</span>
          </a>
          <Button 
            onClick={handleEstimateClick}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium"
          >
            見積り開始
          </Button>
        </div>
      </div>
    </header>
  );
}
