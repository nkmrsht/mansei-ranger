import { Button } from "@/components/ui/button";

export default function ProductShowcase() {
  const products = [
    {
      name: "ダイキン AN28ZRS-W",
      specs: "10畳用・省エネ性能★★★★☆",
      price: "¥89,800",
      originalPrice: "¥120,000",
      discount: "25%OFF",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "三菱電機 MSZ-GV2822",
      specs: "10畳用・高機能モデル",
      price: "¥95,800",
      originalPrice: "¥135,000",
      discount: "29%OFF",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "パナソニック CS-282DFL",
      specs: "10畳用・エオリア",
      price: "¥92,800",
      originalPrice: "¥128,000",
      discount: "27%OFF",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },

  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            本体も地元卸価格で激安提供
          </h2>
          <div className="text-gray-600 max-w-4xl mx-auto space-y-4">
            <p className="text-lg">
              掲載商品は一例です。<br />
              6畳用以外にも、4.5畳～20畳まで全サイズ・全メーカーを取り扱いしています。
            </p>
            <p className="text-base">
              お部屋の広さやご予算、ご希望の機能・メーカーなどに合わせて、<br />
              あなたにピッタリの機種をご提案します！
            </p>
            <p className="text-base">
              「ネットにない型番」「他店で見かけたモデル」「最新の高性能機種」などもOK。<br />
              お気軽にご相談ください。
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index}>
              <div className="bg-white rounded-2xl shadow-sm border border-apple-border overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.specs}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                    </div>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {product.discount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
            まずは相談から始める
          </Button>
        </div>
      </div>
    </section>
  );
}
