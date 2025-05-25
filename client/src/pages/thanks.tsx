import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, MessageCircle } from "lucide-react";

export default function Thanks() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-apple-text mb-6">
                ご予約ありがとうございます
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                エアコン取付工事のご予約を承りました。<br />
                確認メールをお送りしましたので、ご確認ください。
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl border border-apple-border mb-8 max-w-md mx-auto">
                <h3 className="font-bold text-lg mb-4">今後の流れ</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="text-sm">確認のお電話（当日中）</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <span className="text-sm">工事日前日にリマインド連絡</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <span className="text-sm">工事当日にお伺い</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <a href="tel:047-123-4567" className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">047-123-4567</span>
                </a>
                <Button variant="outline" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>LINEで相談</span>
                </Button>
              </div>

              <Link href="/">
                <Button variant="outline">
                  ホームに戻る
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
