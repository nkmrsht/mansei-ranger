import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EstimateWizard() {
  return (
    <section id="estimate-wizard" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            かんたん見積りシミュレーター
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お部屋の情報を入力するだけで、取付工賃を自動計算いたします
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-apple-border p-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calculator className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-apple-text mb-4">見積りロジックが入ります</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ここに部屋のサイズ、エアコン種類、設置条件などを選択するフォームと、リアルタイム価格計算機能を実装予定です。
            </p>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-apple-border">
                <p className="text-sm text-gray-600">
                  <strong>実装予定機能：</strong><br />
                  • 部屋のサイズ選択（6畳〜20畳以上）<br />
                  • エアコンタイプ選択（壁掛け・天井埋込等）<br />
                  • 設置条件入力（配管長、電圧等）<br />
                  • リアルタイム料金計算<br />
                  • 追加工事オプション選択
                </p>
              </div>
              <Link href="/review">
                <Button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                  見積り開始（デモ）
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
