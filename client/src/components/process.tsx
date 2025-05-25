import { Calculator, Calendar, Wrench, CreditCard } from "lucide-react";

export default function Process() {
  const steps = [
    {
      number: "1",
      icon: <Calculator className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "Web見積もり",
      description: "お部屋の情報を入力するだけで、工賃を自動計算。追加料金も事前に確認できます。"
    },
    {
      number: "2",
      icon: <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "ネット予約",
      description: "空いている日程をリアルタイムで確認し、そのままオンラインで工事日をご予約。"
    },
    {
      number: "3",
      icon: <Wrench className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "プロ職人が施工",
      description: "有資格スタッフが迅速かつ丁寧に取付工事を実施。安全性と品質を最優先に。"
    },
    {
      number: "4",
      icon: <CreditCard className="w-8 h-8 text-primary mx-auto mb-4" />,
      title: "オンライン決済",
      description: "工事完了後、事前見積もり通りの金額をオンラインで決済。明朗会計で安心。"
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
            シンプルな4ステップで、スムーズにエアコン取付が完了
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-apple-border">
                {step.icon}
                <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
