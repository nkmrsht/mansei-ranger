import { Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleEstimateClick = () => {
    const estimateSection = document.getElementById('estimate-wizard');
    if (estimateSection) {
      estimateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center space-x-4 mb-8">
          <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">最短当日OK</span>
          <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">千葉・松戸で地元50年</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-apple-text mb-6 leading-tight">
          ネットで買った<br />
          <span className="text-primary">エアコン</span><br />
          取付だけ大歓迎
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Amazon等で格安購入したエアコンの取付工事を、明朗会計・最短当日で承ります。<br />
          地元密着50年の信頼と技術で、安心をお届けします。
        </p>

        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
            alt="Professional air conditioning installation" 
            className="w-full h-auto" 
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button 
            onClick={handleEstimateClick}
            className="bg-primary text-white px-12 py-6 rounded-full text-xl font-medium hover:bg-primary/90 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Calculator className="w-6 h-6" />
            <span>見積り開始</span>
          </Button>
          <a href="tel:047-123-4567">
            <Button variant="outline" className="border-2 border-primary text-primary px-12 py-6 rounded-full text-xl font-medium hover:bg-primary hover:text-white transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
              <Phone className="w-6 h-6" />
              <span>今すぐ電話</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
