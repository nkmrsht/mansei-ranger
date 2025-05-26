import { Award, ShieldCheck, FileText, Headphones, Zap, ShoppingCart } from "lucide-react";

export default function TrustSignals() {
  const trustPoints = [
    {
      icon: <Award className="w-10 h-10 text-green-600" />,
      iconBg: "bg-green-100",
      title: "創業50年の実績",
      description: "地元千葉・松戸で半世紀に渡り、数千件のエアコン工事を手がけてきた確かな技術力。"
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
      iconBg: "bg-blue-100",
      title: "有資格スタッフ",
      description: "電気工事士・冷媒回収技術者など、必要な資格を持ったプロフェッショナルが施工。"
    },
    {
      icon: <FileText className="w-10 h-10 text-purple-600" />,
      iconBg: "bg-purple-100",
      title: "明朗会計",
      description: "事前見積もりで全ての費用を提示。当日の追加料金は一切ありません。"
    },
    {
      icon: <Headphones className="w-10 h-10 text-green-600" />,
      iconBg: "bg-green-100",
      title: "アフターフォロー",
      description: "工事後のトラブルにも迅速対応。地元密着だからこそ可能な手厚いサポート。"
    },
    {
      icon: <Zap className="w-10 h-10 text-orange-600" />,
      iconBg: "bg-orange-100",
      title: "最短当日対応",
      description: "急ぎの工事にも柔軟対応。繁忙期でもできるだけ最短での訪問を心がけています。"
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-red-600" />,
      iconBg: "bg-red-100",
      title: "本体販売も激安",
      description: "取付だけでなく、本体購入もお任せください。地元卸価格で格安提供いたします。"
    }
  ];

  const staff = [
    {
      name: "田中 一郎",
      position: "代表取締役",
      image: "@assets/IMG_3650_fix.jpg",
      comment: "お客様の快適な暮らしを第一に、誠実な工事を心がけています"
    },
    {
      name: "佐藤 二郎",
      position: "技術長・電気工事士",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      comment: "安全で確実な工事を通じて、地域の皆様に貢献したいと思います"
    },
    {
      name: "鈴木 三郎",
      position: "工事主任",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      comment: "細部まで丁寧な施工で、お客様に満足いただける仕上がりを目指します"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
            電化のマンセイの<br className="md:hidden" />安心ポイント
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            50年の実績と地域密着の信頼で、安心のエアコン取付サービスを提供
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trustPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className={`w-20 h-20 ${point.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {point.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {staff.map((member, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
              <img 
                src={member.image}
                alt={`${member.name}の顔写真`}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" 
              />
              <h4 className="font-bold text-lg mb-2">{member.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{member.position}</p>
              <p className="text-sm text-gray-600">「{member.comment}」</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
