import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "取付だけの依頼でも大丈夫ですか？",
      answer: "はい、取付工事のみのご依頼も大歓迎です。Amazonや楽天で購入されたエアコンの取付工事を数多く手がけております。お気軽にお声がけください。"
    },
    {
      question: "見積り後に追加料金は発生しますか？",
      answer: "現地調査後にご提示した「正式なお見積もり」以外の追加料金は一切ございません。\n万が一、現場で想定外の工事が必要となった場合も、必ず事前にご説明し、ご納得いただいてから作業を開始いたします。"
    },
    {
      question: "工事にはどのくらい時間がかかりますか？",
      answer: "標準的な壁掛けエアコンの取付工事であれば、1台あたり約2〜3時間程度です。設置場所の条件や配管の長さによって多少前後いたします。"
    },
    {
      question: "対応エリアを教えてください。",
      answer: "松戸市を中心に、千葉県内（柏市、流山市、野田市、我孫子市、鎌ヶ谷市、市川市、船橋市等）および東京都の一部エリア（葛飾区、江戸川区等）にお伺いしております。詳細はお気軽にお問い合わせください。"
    },
    {
      question: "保証はありますか？",
      answer: "工事完了後1年間の工事保証をお付けしております。工事に起因する不具合については無償で対応いたします。また、定期メンテナンスのご案内も行っております。"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            よくある質問
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お客様からよくいただくご質問にお答えします
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl border border-apple-border overflow-hidden">
              <button 
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
