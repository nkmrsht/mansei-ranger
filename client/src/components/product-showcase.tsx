import { Button } from "@/components/ui/button";

export default function ProductShowcase() {
  const products = [
    {
      name: "シャープ AC-22TFC",
      specs: "6畳用｜シャープ独自の省エネ＆コンパクト設計、寝室・子供部屋に最適なベーシックモデル",
      price: "¥85,000",
      originalPrice: "",
      discount: "標準取付工事費用込み",
      image: "https://placehold.jp/cccccc/ffffff/400x300.png?text=SAMPLE"
    },
    {
      name: "パナソニック CS-225DFL",
      specs: "6畳用｜ナノイーX搭載で空気も清潔。お手入れ簡単・快適スタンダード機種",
      price: "¥105,000",
      originalPrice: "",
      discount: "標準取付工事費用込み",
      image: "https://placehold.jp/cccccc/ffffff/400x300.png?text=SAMPLE"
    },
    {
      name: "パナソニック CS-225DEX",
      specs: "6畳用｜最高クラスの省エネ＆快適性。自動お掃除＆AI快適制御搭載のプレミアムモデル",
      price: "¥174,000",
      originalPrice: "",
      discount: "標準取付工事費用込み",
      image: "https://placehold.jp/cccccc/ffffff/400x300.png?text=SAMPLE"
    },

  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            本体も地元卸価格で激安提供
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            取付工事とセットなら、さらにお得な価格でエアコン本体もご提供できます
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index}>
              <div className="bg-white rounded-2xl shadow-sm border border-apple-border overflow-hidden h-full flex flex-col">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{product.specs}</p>
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">{product.price}</span>
                        <span className="text-xs text-gray-500 ml-1">(税込)</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-700 font-medium">標準取付工事費用込み</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 mb-4">
              6畳以外にも、8畳～20畳まで全サイズ・全メーカーを取り扱いしています。<br />
              お部屋の広さやご予算、ご希望の機能・メーカーなどに合わせて、<br />
              あなたにピッタリの機種をご提案します！
            </p>
            <p className="text-base text-gray-600">
              「ネットにない型番」「他店で見かけたモデル」「最新の高性能機種」などもOK。<br />
              お気軽にご相談ください。
            </p>
          </div>
          <Button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors text-[18px] pt-[28px] pb-[28px]">本体＋取付セットはこちらから</Button>
        </div>
      </div>
    </section>
  );
}
