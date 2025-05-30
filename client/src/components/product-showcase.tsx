import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ProductShowcase() {
  const [, setLocation] = useLocation();
  const products = [
    {
      name: "シャープ AC-22TFC",
      specs: "6畳用｜シャープ独自の省エネ＆コンパクト設計、寝室・子供部屋に最適なベーシックモデル",
      price: "¥85,000",
      originalPrice: "",
      discount: "標準取付工事費用込み",
      image: "https://placehold.jp/cccccc/ffffff/400x300.png?text=SAMPLE",
      modelKey: "sharp-ac22tfc",
      reference: {
        description: "※本商品（AC-22TFC）は専門店モデルのため、公式サイトには掲載がありません。\n同等仕様のモデル「AC-22TFE」の公式製品ページを参考にご覧ください。",
        linkText: "AC-22TFE（シャープ公式）",
        url: "https://jp.sharp/business/aircon/products/tfe/"
      }
    },
    {
      name: "パナソニック CS-225DFL",
      specs: "6畳用｜ナノイーX搭載で空気も清潔。お手入れ簡単・快適スタンダード機種",
      price: "¥106,000",
      originalPrice: "",
      discount: "標準取付工事費用込み",
      image: "https://placehold.jp/cccccc/ffffff/400x300.png?text=SAMPLE",
      modelKey: "panasonic-cs225dfl",
      reference: {
        description: "商品の詳細については、公式製品ページをご参照ください。",
        linkText: "CS-225DFL（パナソニック公式）",
        url: "https://panasonic.jp/housing-aircon/products/CS-225DFL.html"
      }
    },
    {
      name: "パナソニック CS-225DEX",
      specs: "6畳用｜最高クラスの省エネ＆快適性。自動お掃除＆AI快適制御搭載のプレミアムモデル",
      price: "¥175,000",
      originalPrice: "",
      discount: "標準取付工事費用込み",
      image: "https://placehold.jp/cccccc/ffffff/400x300.png?text=SAMPLE",
      modelKey: "panasonic-cs225dex",
      reference: {
        description: "商品の詳細については、公式製品ページをご参照ください。",
        linkText: "CS-225DEX（パナソニック公式）",
        url: "https://panasonic.jp/housing-aircon/products/CS-225DEX.html"
      }
    },
  ];
  const extraSizes = [
    { label: "8畳用", price: "¥199,999（税込）" },
    { label: "10畳用", price: "¥199,999（税込）" },
    { label: "12畳用", price: "¥199,999（税込）" },
  ];

  return (
    <section id="product-showcase" className="py-20 bg-gray-50">
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
                  <p className="text-sm text-gray-600 mb-4 flex-1">{product.specs}
                    <br />
                    <span className="block mt-2 text-xs text-gray-500 whitespace-pre-line">
                      {product.reference.description}
                      <a href={product.reference.url} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-blue-600 hover:text-blue-800">
                        {product.reference.linkText}
                      </a>
                    </span>
                  </p>
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
                  <div className="mt-4 mb-2">
                    {extraSizes.map((size, i) => (
                      <div key={i} className="flex justify-between items-center py-1 border-b last:border-b-0 border-gray-100 text-sm">
                        <span className="font-medium text-gray-700">{size.label}</span>
                        <span className="text-primary font-bold">{size.price.replace('（税込）', '')}<span className="text-xs text-gray-500 font-normal ml-1">（税込）</span></span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="bg-primary text-white w-full mt-2 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors text-base"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.location.pathname === '/') {
                        const el = document.getElementById('estimate-wizard');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      } else {
                        setLocation('/#estimate-wizard');
                      }
                    }}
                  >
                    この機種で見積りを開始する
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 mb-4">
              表示の対応畳数以外にも、6畳～20畳まで全サイズ・全メーカーを取り扱いしています。<br />
              お部屋の広さやご予算、ご希望の機能・メーカーなどに合わせて、<br />
              あなたにピッタリの機種をご提案します！
            </p>
            <p className="text-base text-gray-600">
              「ネットにない型番」「他店で見かけたモデル」「最新の高性能機種」などもOK。<br />
              お気軽にご相談ください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
