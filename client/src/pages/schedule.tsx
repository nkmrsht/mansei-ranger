import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

export default function Schedule() {
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

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Calendar className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-apple-text mb-4">
                日程予約システムが入ります
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                ここにカレンダー表示、空き時間確認、予約確定機能を実装予定です。
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-apple-border">
                  <p className="text-sm text-gray-600">
                    <strong>実装予定機能：</strong><br />
                    • リアルタイム空き状況表示<br />
                    • 希望日時選択<br />
                    • 担当者選択<br />
                    • お客様情報入力<br />
                    • 予約確定処理
                  </p>
                </div>
                <Link href="/thanks">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    予約を確定する（デモ）
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
