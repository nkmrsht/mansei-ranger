import { Calculator, Calendar, MapPin, Wrench, Shield } from "lucide-react";

export default function Process() {
  const steps = [
    {
      number: "1",
      icon: <Calculator className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "Webでかんたん見積もり",
      description: "必要情報を入力するだけで、目安金額がすぐに分かります。"
    },
    {
      number: "2",
      icon: <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "オンラインで訪問日時を予約",
      description: "カレンダーからご希望の日程を選択できます。"
    },
    {
      number: "3",
      icon: <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "スタッフがご自宅へ訪問・現地調査",
      description: "設置場所や状況を確認し、「正式な見積もり」をその場でご提示。"
    },
    {
      number: "4",
      icon: <Wrench className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "ご納得いただけたら、そのまま取付工事",
      description: "当日の工事も対応可能。追加料金なし、明朗会計。"
    },
    {
      number: "5",
      icon: <Shield className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "お支払い＆アフターサポート",
      description: "お支払い方法も選べて安心。地元密着54年のサポートで、取付後もずっと安心！"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            取付までの流れ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            シンプルな5ステップで、スムーズにエアコン取付が完了
          </p>
        </div>

        {/* デスクトップ表示 */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* 接続線 */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0"></div>
            
            <div className="grid lg:grid-cols-5 gap-6 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-10 -right-3 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* モバイル・タブレット表示 */}
        <div className="lg:hidden">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-primary/30 mx-auto mt-4"></div>
                  )}
                </div>
                
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-3">
                    {step.icon}
                    <h3 className="text-lg font-bold ml-3 text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
