import { XCircle, Clock, Search, HelpCircle } from "lucide-react";

export default function Problems() {
  const problems = [
    {
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      iconBg: "bg-red-100",
      title: "工事費用がよく分からず、不安で決めきれない",
      description: "「本体は安く買えたけど、工事費用が結局いくらになるのか不安…」\n「あとから追加料金を請求されたらどうしよう…」\n\"最初にすべての費用を知りたい\"という声がとても多いです。"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      iconBg: "bg-orange-100",
      title: "申込から取付までが遅い・すぐに使えない",
      description: "「暑くなってきたのに、取付の予約がなかなか取れない…」\n「早く使いたいのに、工事は2週間後って言われた…」\n\"できるだけ早く、最短で設置してほしい\"と思いませんか？"
    },
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      title: "本体だけネットで買ったら、取付業者探しが大変",
      description: "「ネットで安くエアコン本体は買えたけど、\"取付だけ\"お願いできる業者が見つからない…」\n「どこに頼めばいいのか分からないし、断られそうで不安…」\n\"気軽に取付だけ頼みたい\"という声が急増しています。"
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      iconBg: "bg-purple-100",
      title: "取付だけ頼むと、嫌がられたり追加料金が心配",
      description: "「取付だけお願いしたいけど、断られたり、嫌な顔されそう…」\n「当日になって\"追加で費用がかかります\"と言われないか不安…」\n\"すべて明朗会計で安心して頼みたい\"というご要望が増えています。"
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
              <div className="text-gray-600">{problem.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
