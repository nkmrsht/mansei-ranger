import { Zap, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMansei from "../assets/images/logo-mansei.jpg";

export default function Footer() {
  const handleEstimateClick = () => {
    const estimateSection = document.getElementById('estimate-wizard');
    if (estimateSection) {
      estimateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-apple-text text-white py-16 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logoMansei}
                alt="電化のマンセイ ロゴ"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold">電化のマンセイ</h3>
                <p className="text-sm text-gray-300">エアコン取付だけも大歓迎！ネット購入・持込OK、明朗会計で安心</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">〒270-2241 千葉県松戸市松戸新田24</p>
              <p className="text-gray-300">TEL : 047-364-8112</p>
              <p className="text-gray-300">営業時間 9:00〜18:00　土日祝は休みです</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">会社情報</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://d-mansei.co.jp/about" className="hover:text-white transition-colors">電化のマンセイについて</a></li>
              <li><a href="https://d-mansei.co.jp/service" className="hover:text-white transition-colors">電化のマンセイができること</a></li>
              <li><a href="https://d-mansei.co.jp/blog" className="hover:text-white transition-colors">スタッフブログ</a></li>
              <li><a href="https://d-mansei.co.jp/contact" className="hover:text-white transition-colors">お問い合わせ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">お問い合わせ</h4>
            <div className="space-y-4">
              <a href="tel:047-364-8112" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>047-364-8112</span>
              </a>
              <a href="https://lin.ee/0OsWYCs" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>LINEで相談</span>
              </a>
              <Button 
                onClick={handleEstimateClick}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium w-full"
              >
                無料見積り
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 電化のマンセイ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
