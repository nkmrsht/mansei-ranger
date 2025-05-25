import { Zap, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">電化のマンセイ</h3>
                <p className="text-sm text-gray-300">創業50年の信頼</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              千葉県松戸市を中心に、50年にわたりエアコン取付工事を手がけてまいりました。
              お客様の快適な暮らしを第一に、誠実で確かな技術をお届けします。
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">〒271-0000 千葉県松戸市○○町1-2-3</p>
              <p className="text-gray-300">TEL: 047-123-4567</p>
              <p className="text-gray-300">営業時間: 9:00〜18:00（年中無休）</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">サービス</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">エアコン取付</a></li>
              <li><a href="#" className="hover:text-white transition-colors">エアコン販売</a></li>
              <li><a href="#" className="hover:text-white transition-colors">メンテナンス</a></li>
              <li><a href="#" className="hover:text-white transition-colors">修理・点検</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">お問い合わせ</h4>
            <div className="space-y-4">
              <a href="tel:047-123-4567" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>047-123-4567</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
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
          <p>&copy; 2024 電化のマンセイ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
