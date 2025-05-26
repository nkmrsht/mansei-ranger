import React from "react";
import { Calculator, Calendar, MapPin, Wrench, Shield, ArrowRight, ChevronDown } from "lucide-react";

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
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-2 mb-6">
            <span className="text-primary font-semibold text-sm">簡単5ステップ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            取付までの流れ
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            シンプルで分かりやすいプロセスで、<br className="hidden md:block" />
            スムーズにエアコン取付が完了します
          </p>
        </div>

        {/* デスクトップ表示 */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="grid lg:grid-cols-5 gap-6 relative z-10 py-12 px-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center group relative">
                  <div className="relative mb-8 flex items-center justify-center">
                    {/* 番号サークル */}
                    <div className="w-24 h-24 bg-gradient-to-br from-primary via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110">
                      <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                      <span className="text-2xl font-bold text-white relative z-10">{step.number}</span>
                    </div>
                    

                    
                    {/* 矢印 - シンプルなSVGデザイン */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 z-20">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/90 h-72 flex flex-col">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-blue-100 rounded-2xl mx-auto flex items-center justify-center text-primary text-2xl pt-6 pb-2 px-2">
                        <div className="flex items-center justify-center w-full h-full" style={{lineHeight: '0'}}>
                          {step.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm flex-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* モバイル・タブレット表示 */}
        <div className="lg:hidden">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6 group">
                <div className="flex-shrink-0 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                    <span className="text-xl font-bold text-white relative z-10">{step.number}</span>
                  </div>
                  

                  
                  {index < steps.length - 1 && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
                      <svg className="w-6 h-6 text-primary mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 group-hover:shadow-xl transition-all duration-300 group-hover:bg-white/90">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-blue-100 rounded-xl mr-4 flex items-center justify-center flex-shrink-0 text-primary text-xl pt-6 pb-2 px-2">
                      <div className="flex items-center justify-center w-full h-full" style={{lineHeight: '0'}}>
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                    </div>
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
