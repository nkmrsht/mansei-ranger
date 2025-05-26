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
      <div className="max-w-7xl mx-auto px-4">
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
            {/* 背景の装飾要素 */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl"></div>
            
            {/* 接続線とドット */}
            <div className="absolute top-32 left-20 right-20 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary to-primary/60 animate-pulse"></div>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-8 relative z-10 py-12">
              {steps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    {/* 番号サークル */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary via-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110">
                        <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                        <span className="text-2xl font-bold text-white relative z-10">{step.number}</span>
                      </div>
                      
                      {/* パルス効果 */}
                      <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full mx-auto animate-ping opacity-75"></div>
                      
                      {/* 矢印アイコン */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-8 -right-8 z-20">
                          <div className="relative">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100/50">
                              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                            <div className="absolute inset-0 w-16 h-16 bg-primary/10 rounded-full animate-ping"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/90">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-100 rounded-2xl mx-auto">
                        <div className="w-full h-full flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
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
                  
                  {/* パルス効果 */}
                  <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full animate-ping opacity-50"></div>
                  
                  {index < steps.length - 1 && (
                    <div className="absolute top-20 left-10 flex flex-col items-center z-20">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-primary/60 to-primary/20"></div>
                      <div className="relative">
                        <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-gray-100/50 mt-2">
                          <div className="w-6 h-6 bg-gradient-to-b from-primary to-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute inset-0 w-12 h-12 bg-primary/10 rounded-full animate-ping mt-2"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 group-hover:shadow-xl transition-all duration-300 group-hover:bg-white/90">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-blue-100 rounded-xl mr-4">
                      <div className="w-full h-full flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部の装飾要素 */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">最短当日対応可能</span>
          </div>
        </div>
      </div>
    </section>
  );
}
