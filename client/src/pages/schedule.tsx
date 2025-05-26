import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { useEffect } from "react";

export default function Schedule() {
  useEffect(() => {
    // Jicooウィジェットのスクリプトを動的に読み込み
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.jicoo.com/widget/event_type.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // クリーンアップ
      const existingScript = document.querySelector('script[src="https://www.jicoo.com/widget/event_type.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/review">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              見積り確認に戻る
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            工事日程の予約
          </h1>
        </div>

        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-apple-text mb-4">
                ご希望の工事日程をお選びください
              </h2>
              <p className="text-gray-600 mb-6">
                下記のカレンダーからご都合の良い日時をお選びいただけます。お急ぎの場合はお気軽にお電話でもお問い合わせください。
              </p>
            </div>
            
            {/* Jicoo Widget */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div 
                className="jicoo-widget" 
                data-url="https://www.jicoo.com/event_types/o-P4XTBDZeLW/widget" 
                style={{minWidth: '320px', height: '720px', border: '1px solid #e4e4e4', boxSizing: 'content-box'}}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
