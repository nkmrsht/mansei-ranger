import { Phone, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoMansei from "../assets/images/logo-mansei.jpg";

export default function Header() {
  const handleEstimateClick = () => {
    const estimateSection = document.getElementById('estimate-wizard');
    if (estimateSection) {
      estimateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-primary md:bg-white border-b border-apple-border">
      <div className="max-w-6xl mx-auto px-0 md:px-8 py-2 md:py-1 flex items-center justify-between">
        {/* スマホ：現状維持 */}
        <div className="block md:hidden w-full overflow-x-hidden">
          <div className="whitespace-nowrap animate-marquee font-bold text-base text-white leading-tight" style={{animation: 'marquee 100s linear infinite'}}>
            エアコン取付のみ・本体持込も大歓迎！ネットや他店で購入したエアコンもOK。地域密着のプロが明朗会計＆安心施工でスピード対応。ご自宅・店舗・オフィス・引越しや移設もご相談OK。全メーカー・全機種対応、相談・見積り無料！
          </div>
        </div>
        {/* PC：世界的Webデザイナー風 */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center space-x-5">
            <img
              src={logoMansei}
              alt="電化のマンセイ ロゴ"
              className="w-24 h-24 object-contain"
              style={{ minWidth: 72, minHeight: 72 }}
            />
            <span className="text-sm text-gray-400 font-normal tracking-wide">
              エアコン取付だけも大歓迎！ネット購入・持込OK、明朗会計で安心
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://lin.ee/ozlb11w"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors font-medium text-base px-4 py-2 rounded-full hover:bg-blue-50"
              style={{ transition: 'background 0.2s, color 0.2s' }}
            >
              <MessageCircle className="w-5 h-5" />
              LINEで相談
            </a>
            <Button
              onClick={handleEstimateClick}
              className="bg-primary text-white px-7 py-2 rounded-full text-base font-semibold shadow-none hover:bg-blue-700 transition-colors"
              style={{ letterSpacing: '0.02em' }}
            >
              見積り開始
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
