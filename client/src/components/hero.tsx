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
          <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">千葉県松戸市で創業54年</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-apple-text mb-6 leading-tight">
          エアコン本体も工事も<br />
          もっと<span className="text-primary">お得に！</span><br />
          取付工事だけでもOK
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          ネットや量販店で買ったエアコンの「取付だけ」でも大歓迎！<br />
          エアコン本体も、地元の電気屋ならではの業者卸価格でご用意しました。<br />
          本体＋標準取付セットもラインナップ
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12 max-w-3xl mx-auto">
          <p className="text-lg font-semibold text-gray-800 mb-2">明朗会計＆最短当日工事、創業54年の地元密着で安心サポート。</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              ネット購入エアコンの取付OK
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              業者卸価格で本体販売
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              本体+工事セットも対応
            </span>
          </div>
        </div>

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
