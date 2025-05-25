import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function Review() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            見積り内容の確認
          </h1>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-apple-text mb-4">
                見積り確認画面が入ります
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                ここに見積り詳細、工事内容、料金内訳などの確認UI を実装予定です。
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-apple-border">
                  <p className="text-sm text-gray-600">
                    <strong>実装予定機能：</strong><br />
                    • 見積り詳細表示<br />
                    • 工事内容確認<br />
                    • 料金内訳表示<br />
                    • 修正・変更機能<br />
                    • 予約画面への遷移
                  </p>
                </div>
                <Link href="/schedule">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    この内容で予約に進む
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
