import { Star } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      name: "松戸市 A様",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      rating: 5,
      comment: "Amazonで買ったエアコンの取付をお願いしました。見積もりが明確で、当日も追加料金なし。手際よく丁寧に工事していただき、大満足です！"
    },
    {
      name: "柏市 B様", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      rating: 5,
      comment: "他社では『取付だけ』を嫌がられましたが、こちらは快く引き受けてくれました。技術力も高く、地元の業者さんで安心感があります。"
    },
    {
      name: "千葉市 C様",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      rating: 5,
      comment: "急な依頼でしたが、翌日に来ていただけました。工事も丁寧で、アフターサポートの説明も詳しく、とても信頼できる業者さんです。"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            お客様の声
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            実際にサービスをご利用いただいたお客様からの評価
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-apple-border">
              <div className="flex items-center mb-4">
                <img 
                  src={review.image}
                  alt={`${review.name}の顔写真`}
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-bold">{review.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
