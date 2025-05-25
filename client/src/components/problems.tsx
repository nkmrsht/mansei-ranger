import { XCircle, Clock, Search, HelpCircle } from "lucide-react";

export default function Problems() {
  const problems = [
    {
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      iconBg: "bg-red-100",
      title: "高い工賃で断れない",
      description: "家電量販店で営業トークに負けて、内訳不明な高額工賃を支払った経験はありませんか？"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      iconBg: "bg-orange-100",
      title: "設置まで2週間待ち",
      description: "繁忙期になると工事日程が大幅に遅れ、暑い中でエアコンなしの生活を強いられる..."
    },
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      title: "取付業者が見つからない",
      description: "Amazonで本体を安く買ったものの、取付工事を依頼できる業者を探すのが困難..."
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-100",
      title: "追加料金が心配",
      description: "「取付だけ」を依頼すると嫌がられそう、当日に高額な追加料金を請求されるのでは？"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            こんなお悩み<br className="md:hidden" />ありませんか？
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            エアコン購入から設置まで、多くの方が抱える課題を解決します
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-apple-border">
              <div className={`w-12 h-12 ${problem.iconBg} rounded-full flex items-center justify-center mb-4`}>
                {problem.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{problem.title}</h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
